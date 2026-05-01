from pdf2image import convert_from_path
import pytesseract

def get_report_from_pdf():
    images = convert_from_path("uploads/sample.pdf")
    report = ""
    for img in images:
        report += pytesseract.image_to_string(img)
    return report