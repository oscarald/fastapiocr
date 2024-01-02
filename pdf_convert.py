import pdf2image
import PyPDF2


def image_conversion(inpath, image_path, paginas):
    print("Converting to image")
    OUTPUT_FOLDER = image_path
    FIRST_PAGE = 1
    LAST_PAGE = paginas
    FORMAT = 'jpg'
    USERPWD = None
    USE_CROPBOX = False
    STRICT = False
    pil_images = pdf2image.convert_from_path(inpath,
                                             output_folder=OUTPUT_FOLDER,
                                             first_page=FIRST_PAGE,
                                             last_page=LAST_PAGE,
                                             fmt=FORMAT,
                                             userpw=USERPWD,
                                             use_cropbox=USE_CROPBOX,
                                             strict=STRICT)
    for image in pil_images:
        image.save(image_path + 'image_converted.jpg')


def contar_paginas_pdf(ruta_pdf):
    print('CONTANDO PAGINAS', ruta_pdf)
    with open(ruta_pdf, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_paginas = len(pdf_reader.pages)
            return num_paginas
# inpath = "D://CODE//OCR//inpath//caso.pdf"
# image_path = "D://CODE//OCR//image_path//"
# image_conversion(inpath, image_path)
