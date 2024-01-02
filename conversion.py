import cv2
import pytesseract


def transform_ocr(input_dir, output_dir, paginas=1):
    pytesseract.pytesseract.tesseract_cmd = 'C://Program Files//Tesseract-OCR//tesseract.exe'
    TESSDATA_PREFIX = 'C://Program Files//Tesseract-OCR'

    tessdata_dir_config = '--tessdata-dir "C://Program Files//Tesseract-OCR//tessdata"'
    # input_dir = "D://CODE//OCR//image_path//optimized//Optimized_page_1.jpg"
    print("input_dir = "+ input_dir )
    img = cv2.imread(input_dir, 1)


    result = pytesseract.image_to_pdf_or_hocr(
        img, lang="spa", config=tessdata_dir_config)
    print("CREATTTTTTTTTTTTTTING ")
    f = open(output_dir, "w+b")
    f.write(bytearray(result))
    f.close()
