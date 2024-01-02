import cv2
import pytesseract
from PyPDF2 import PdfWriter, PdfReader
import io

def transform_ocr(input_dir, output_dir, nombreuuid, paginas):
    print("paginas desde conversion", paginas)
    print("paginas desde conversion", nombreuuid)
    pytesseract.pytesseract.tesseract_cmd = 'C://Program Files//Tesseract-OCR//tesseract.exe'
    TESSDATA_PREFIX = 'C://Program Files//Tesseract-OCR'

    tessdata_dir_config = '--tessdata-dir "C://Program Files//Tesseract-OCR//tessdata"'
    # input_dir = "D://CODE//OCR//image_path//optimized//Optimized_page_1.jpg"
    print("input_dir = "+ input_dir )
    resultados = []
    # f = open(output_dir, "wb")
    for i in range(0, paginas):
        imagen = f'{nombreuuid}-{i+1}.jpg'
        print('PATHHHHH',input_dir+imagen)
        img = cv2.imread(input_dir+imagen, 1)
        result = pytesseract.image_to_pdf_or_hocr(
            img, lang="spa", config=tessdata_dir_config)
        print("CREATTTTTTTTTTTTTTING ", i)
        # f.write(bytearray(result))
        # f.write(bytearray(result))
        resultados.append(bytearray(result))

    pdf_writer = PdfWriter()
    # pdf_writer.compress = True

    for resultado in resultados:
        pdf_reader = PdfReader(io.BytesIO(resultado))
        pdf_writer.add_page(pdf_reader.pages[0])
    
    with open(output_dir, 'wb') as pdf_file:
        pdf_writer.write(pdf_file)

    # f.close()

    
