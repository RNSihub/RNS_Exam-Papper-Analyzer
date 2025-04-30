import streamlit as st
import os
import tempfile
from PIL import Image
import PyPDF2
import fitz  # PyMuPDF
import platform
import base64
import io
import google.generativeai as genai
from pdf2image import convert_from_path

# Set page configuration
st.set_page_config(page_title="PDF Text Extractor with Gemini AI", layout="wide")

# Title and description
st.title("PDF Text Extractor with Gemini AI")
st.markdown("""
This application extracts text from PDF files using multiple methods:
1. Direct text extraction from the PDF
2. OCR on each page using Google's Gemini model 2.0 Flash
3. Special handling for scanned documents
""")

# Gemini API setup

GEMINI_API_KEY = "AIzaSyApb3uEAndgRMBIvIYGULdoO3xFcYcYJeU"

# Initialize the GenAI client
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Function to extract text from images using Gemini 2.0 Flash
def extract_text_with_gemini(image):
    try:
        # Convert the image to base64
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # Prepare the request for Gemini API
        prompt = "Extract all the text from this image. Return only the extracted text with no additional commentary."
        image_part = {
            "mime_type": "image/jpeg",
            "data": img_str
        }

        # Make the request to Gemini API using GenAI client
        response = model.generate_content(
            contents=[prompt, image_part],
            generation_config={
                "temperature": 0.1,
                "top_p": 0.95,
                "max_output_tokens": 8192
            }
        )

        if response.text:
            return response.text.strip()
        else:
            return "No text extracted by Gemini."

    except Exception as e:
        st.warning(f"Error with Gemini API: {str(e)}.")
        return ""

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

# Check if poppler is installed and provide installation instructions if not
def check_poppler_installed():
    try:
        # This will only be used if we import pdf2image
        convert_from_path("test.pdf")
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

# Function to convert PDF to images (only called if poppler is available)
def convert_pdf_to_images(pdf_path):
    try:
        return convert_from_path(pdf_path)
    except Exception as e:
        st.error(f"Error converting PDF to images: {str(e)}")
        return []

# Function to process PDF with both direct extraction and AI-powered OCR
def process_pdf_complete(pdf_path):
    results = []

    try:
        # Step 1: Extract text directly from PDF
        direct_text = extract_text_from_pdf(pdf_path)
        direct_text_pages = direct_text.split("\n\n")

        # Step 2: Check if we can use pdf2image for OCR
        poppler_installed, _ = check_poppler_installed()

        if poppler_installed:
            with st.spinner('Converting PDF to images...'):
                images = convert_from_path(pdf_path)

            # Process each page with Gemini OCR
            for i, image in enumerate(images):
                with st.spinner(f'Processing page {i+1}/{len(images)} with Gemini AI...'):
                    # First try with Gemini
                    gemini_text = extract_text_with_gemini(image)

                # Add to results
                results.append({
                    "page": i+1,
                    "direct_text": direct_text_pages[i] if i < len(direct_text_pages) else "",
                    "gemini_text": gemini_text
                })
        else:
            # If poppler is not available, use only direct text extraction
            for i, page_text in enumerate(direct_text_pages):
                if page_text.strip():  # Only add non-empty pages
                    results.append({
                        "page": i+1,
                        "direct_text": page_text,
                        "gemini_text": "Gemini OCR not available (poppler not installed)"
                    })

        return results
    except Exception as e:
        st.error(f"Error processing PDF: {str(e)}")
        return []

# Function to extract text from uploaded images
def process_images(uploaded_images):
    results = []
    for i, uploaded_image in enumerate(uploaded_images):
        with st.spinner(f'Processing image {i+1}/{len(uploaded_images)} with Gemini AI...'):
            image = Image.open(uploaded_image)

            # First try with Gemini
            gemini_text = extract_text_with_gemini(image)

        results.append({
            "image": i+1,
            "gemini_text": gemini_text
        })
    return results

# Function to get best text from different extraction methods
def get_best_text(direct_text, gemini_text):
    direct_text = direct_text.strip()
    gemini_text = gemini_text.strip()

    # If Gemini returned a substantial result, prefer it
    if gemini_text and gemini_text != "No text extracted by Gemini." and len(gemini_text) > 20:
        return gemini_text

    # If direct text extraction worked well, use it
    if len(direct_text) > 50:
        return direct_text

    # Default to whatever has content
    if direct_text:
        return direct_text
    elif gemini_text and gemini_text != "No text extracted by Gemini.":
        return gemini_text
    else:
        return "No text could be extracted from this page."

# Main application flow
def main():
    global GEMINI_API_KEY  # Declare the global variable here

    # API key input
    with st.sidebar:
        custom_api_key = st.text_input("Gemini API Key (Optional)", value=GEMINI_API_KEY, type="password")
        if custom_api_key and custom_api_key != GEMINI_API_KEY:
            GEMINI_API_KEY = custom_api_key
            genai.configure(api_key=GEMINI_API_KEY)
            st.success("API key updated")

        st.markdown("### About")
        st.info("""
        This tool uses Google's Gemini 2.0 Flash AI model to extract text from PDFs and images.
        It combines traditional extraction methods with AI for better results.
        """)

    # Check for poppler and display installation message if needed
    poppler_installed, installation_guide = check_poppler_installed()
    if not poppler_installed:
        st.warning("⚠️ Poppler is not installed or not in PATH. OCR functionality will be limited.")
        st.markdown(installation_guide)
        st.markdown("You can still use the app with limited functionality.")

    # File upload
    col1, col2 = st.columns(2)
    with col1:
        uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")
    with col2:
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
                    # Get the best text from all methods
                    best_text = get_best_text(r['direct_text'], r['gemini_text'])
                    combined_text += best_text + "\n\n"

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
                        st.write(f"**Page {r['page']}**")
                        col1, col2 = st.columns(2)

                        with col1:
                            st.write("Direct PDF Extraction:")
                            st.text_area("Direct", r['direct_text'], height=150, key=f"direct_{r['page']}")

                        with col2:
                            st.write("Gemini AI Extraction:")
                            st.text_area("Gemini", r['gemini_text'], height=300, key=f"gemini_{r['page']}")

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
                best_text = get_best_text("", r['gemini_text'])
                combined_text += best_text + "\n\n"

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
            with st.expander("Advanced: View extraction results for each image"):
                for r in results:
                    st.write(f"**Image {r['image']}**")
                    col1, col2 = st.columns(2)

                    with col1:
                        st.write("Gemini AI Extraction:")
                        st.text_area("Gemini", r['gemini_text'], height=300, key=f"gemini_image_{r['image']}")

                    st.divider()

    else:
        # Display example when no file is uploaded
        st.info("Please upload a PDF file or images to extract text.")

        # Sample usage instructions
        st.subheader("How it works")
        st.markdown("""
        This tool uses multiple methods to ensure ALL text is extracted:

        1. **Google's Gemini 2.0 Flash AI** - Advanced AI-powered text extraction from images and PDFs
        2. **Direct PDF text extraction** - Gets text that's directly encoded in the PDF
        3. **Smart combination** - Combines all methods to get the most complete text

        Just upload your PDF or images and get complete text extraction!
        """)

if __name__ == "__main__":
    main()
