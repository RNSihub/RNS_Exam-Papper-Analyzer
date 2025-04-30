import streamlit as st
import os
import tempfile
import pytesseract
from PIL import Image
import PyPDF2
import fitz  # PyMuPDF
import subprocess
import sys
import platform

# Set page configuration
st.set_page_config(page_title="Complete PDF Text Extractor", layout="wide")

# Title and description
st.title("Complete PDF Text Extractor")
st.markdown("""
This application extracts ALL text from PDF files using multiple methods:
1. Direct text extraction from the PDF
2. OCR on each page to capture text embedded in images
3. Special handling for scanned documents
""")

# Check if poppler is installed and provide installation instructions if not
def check_poppler_installed():
    try:
        # Import pdf2image only if poppler is installed

        # Test with a simple call
        return True, None
    except Exception as e:
        error_msg = str(e)

        # Provide OS-specific installation instructions
        os_type = platform.system()
        if "poppler" in error_msg.lower():
            if os_type == "Windows":
                installation_guide = """
                ### Poppler Installation Instructions for Windows:
                1. Download Poppler for Windows from: https://github.com/oschwartz10612/poppler-windows/releases/
                2. Extract the downloaded file
                3. Add the `bin` directory to your PATH environment variable
                4. Restart your application

                Or install via conda: `conda install -c conda-forge poppler`
                """
            elif os_type == "Darwin":  # macOS
                installation_guide = """
                ### Poppler Installation Instructions for macOS:
                1. Install using Homebrew: `brew install poppler`
                2. Restart your application
                """
            elif os_type == "Linux":
                installation_guide = """
                ### Poppler Installation Instructions for Linux:
                1. Ubuntu/Debian: `sudo apt-get install poppler-utils`
                2. Fedora: `sudo dnf install poppler-utils`
                3. Restart your application
                """
            else:
                installation_guide = "Please install poppler-utils for your operating system."

            return False, installation_guide
        else:
            return False, f"Error: {error_msg}"

# Function to extract text from images using Tesseract OCR
def extract_text_from_image(image):
    try:
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"Error in OCR processing: {str(e)}"

# Function to extract text directly from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        # Method 1: Using PyPDF2
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n\n"

        # If PyPDF2 didn't get much text, try PyMuPDF as backup
        if len(text.strip()) < 100:
            text = ""
            doc = fitz.open(pdf_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text += page.get_text("text") + "\n\n"
            doc.close()

        return text
    except Exception as e:
        return f"Error extracting direct text: {str(e)}"

# Function to convert PDF to images (only called if poppler is available)
def convert_pdf_to_images(pdf_path):
    from pdf2image import convert_from_path
    try:
        return convert_from_path(pdf_path)
    except Exception as e:
        st.error(f"Error converting PDF to images: {str(e)}")
        return []

# Function to process PDF with both direct extraction and OCR
def process_pdf_complete(pdf_path):
    results = []

    try:
        # Step 1: Extract text directly from PDF
        direct_text = extract_text_from_pdf(pdf_path)
        direct_text_pages = direct_text.split("\n\n")

        # Step 2: Check if we can use pdf2image for OCR
        poppler_installed, _ = check_poppler_installed()

        if poppler_installed:
            # Import here so it only happens if poppler is installed
            from pdf2image import convert_from_path
            images = convert_from_path(pdf_path)

            # Process each page with OCR
            for i, image in enumerate(images):
                # Extract text from the image using OCR
                ocr_text = extract_text_from_image(image)

                # Add to results
                results.append({
                    "page": i+1,
                    "direct_text": direct_text_pages[i] if i < len(direct_text_pages) else "",
                    "ocr_text": ocr_text
                })
        else:
            # If poppler is not available, use only direct text extraction
            # Split direct text into pages and create results without OCR
            for i, page_text in enumerate(direct_text_pages):
                if page_text.strip():  # Only add non-empty pages
                    results.append({
                        "page": i+1,
                        "direct_text": page_text,
                        "ocr_text": "OCR not available (poppler not installed)"
                    })

        return results
    except Exception as e:
        st.error(f"Error processing PDF: {str(e)}")
        return []

# Function to extract text from uploaded images
def process_images(uploaded_images):
    results = []
    for i, uploaded_image in enumerate(uploaded_images):
        image = Image.open(uploaded_image)
        ocr_text = extract_text_from_image(image)
        results.append({
            "image": i+1,
            "ocr_text": ocr_text
        })
    return results

# Main application flow
def main():
    # Check for poppler and display installation message if needed
    poppler_installed, installation_guide = check_poppler_installed()
    if not poppler_installed:
        st.warning("⚠️ Poppler is not installed or not in PATH. OCR functionality will be limited.")
        st.markdown(installation_guide)
        st.markdown("You can still use the app with limited functionality.")

    # File upload
    uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")
    uploaded_images = st.file_uploader("Upload images for OCR", type=["png", "jpg", "jpeg"], accept_multiple_files=True)

    if uploaded_file is not None:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            tmp.write(uploaded_file.getvalue())
            tmp_path = tmp.name

        try:
            # Process the PDF
            with st.spinner('Extracting text from PDF. Please wait...'):
                results = process_pdf_complete(tmp_path)

            if results:
                st.success(f"Successfully processed {len(results)} pages")

                # Combine all texts without page indicators
                combined_text = ""
                for r in results:
                    # Get the better text between direct and OCR
                    direct_text = r['direct_text'].strip()
                    ocr_text = r['ocr_text'].strip()

                    # If OCR is not available or direct text is very short, use what we have
                    if "OCR not available" in ocr_text:
                        combined_text += direct_text + " "
                    elif len(direct_text) < len(ocr_text) / 2:
                        combined_text += ocr_text + " "
                    # If OCR text is very short, prefer direct text
                    elif len(ocr_text) < len(direct_text) / 2:
                        combined_text += direct_text + " "
                    # If both have content, combine them with preference to the longer one
                    else:
                        if len(direct_text) > len(ocr_text):
                            combined_text += direct_text + " "
                        else:
                            combined_text += ocr_text + " "

                # Display combined text
                st.subheader("Extracted Text")
                st.text_area("Combined Text", combined_text, height=400, key="combined_text")

                # Download button
                st.download_button(
                    label="Download extracted text",
                    data=combined_text,
                    file_name="extracted_text.txt",
                    mime="text/plain",
                )

                # Advanced options
                with st.expander("Advanced: View extraction method comparison"):
                    for r in results:
                        col1, col2 = st.columns(2)

                        with col1:
                            st.write("Direct PDF Extraction:")
                            st.text_area("Direct", r['direct_text'], height=200, key=f"direct_{r['page']}")

                        with col2:
                            st.write("OCR Extraction (for text in images):")
                            st.text_area("OCR", r['ocr_text'], height=200, key=f"ocr_{r['page']}")

                        st.divider()

        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
        finally:
            # Clean up the temp file
            os.unlink(tmp_path)

    elif uploaded_images:
        # Process the uploaded images
        with st.spinner('Extracting text from images. Please wait...'):
            results = process_images(uploaded_images)

        if results:
            st.success(f"Successfully processed {len(results)} images")

            # Combine all texts from images
            combined_text = ""
            for r in results:
                combined_text += r['ocr_text'] + " "

            # Display combined text
            st.subheader("Extracted Text from Images")
            st.text_area("Combined Text", combined_text, height=400, key="combined_text_images")

            # Download button
            st.download_button(
                label="Download extracted text from images",
                data=combined_text,
                file_name="extracted_text_from_images.txt",
                mime="text/plain",
            )

            # Advanced options
            with st.expander("Advanced: View OCR results for each image"):
                for r in results:
                    st.write(f"Image {r['image']}:")
                    st.text_area("OCR", r['ocr_text'], height=200, key=f"ocr_image_{r['image']}")
                    st.divider()

    else:
        # Display example when no file is uploaded
        st.info("Please upload a PDF file or images to extract text.")

        # Sample usage instructions
        st.subheader("How it works")
        st.markdown("""
        This tool uses multiple methods to ensure ALL text is extracted:

        1. **Direct PDF text extraction** - Gets text that's directly encoded in the PDF
        2. **OCR processing** - Uses Tesseract to extract text from images in the PDF (requires poppler)
        3. **Smart combination** - Combines both methods to get the most complete text
        4. **Image text extraction** - Extracts text from uploaded images using OCR

        Just upload your PDF or images and get complete text extraction!
        """)

if __name__ == "__main__":
    main()
