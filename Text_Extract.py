import streamlit as st
from PIL import Image
import pytesseract
import os

# Optional: Manually specify Tesseract path (for Windows users)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

st.title("📝 Image Text Extractor")
st.write("Upload an image containing printed or handwritten text to extract it using Tesseract OCR.")

# Upload image
uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

    with st.spinner("🔍 Extracting text..."):
        # Convert image to text
        extracted_text = pytesseract.image_to_string(image)

    st.subheader("📄 Extracted Text:")
    st.text_area("Text", extracted_text, height=300)
