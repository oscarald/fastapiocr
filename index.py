import os
from fastapi import FastAPI, File, UploadFile
import uuid
from conversion import transform_ocr
from pdf_convert import image_conversion, contar_paginas_pdf
import binascii
from starlette.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text, extract_pages

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://0.0.0.0:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/obtener-texto')
async def read_file(file: UploadFile = File(...)):
    dir_path = os.path.dirname(os.path.realpath(__file__))

    salida = '/uploads/'

    existeUploads = os.path.exists(salida)
    if not existeUploads:
        os.mkdir(salida)

    nombreArchivo = f'{str(uuid.uuid4())}-{file.filename}'
    f = open(f'{salida}{nombreArchivo}', 'wb')
    content = await file.read()
    f.write(content)
    paginas = []
    for page in range(len(list(extract_pages(f'{salida}{nombreArchivo}')))):
        texto = extract_text(
            f'{salida}{nombreArchivo}', '', [page])
        paginas.append(texto.replace('\n', ''))

    return {
        'finalizado': True,
        'mensaje': 'OK',
        'datos': paginas
    }


@app.post('/upload-file')
async def create_file(file: UploadFile = File(...)):
    dir_path = os.path.dirname(os.path.realpath(__file__))

    existeUploads = os.path.exists('{dir_path}/uploads/')
    nombreuuid = uuid.uuid4()
    print (nombreuuid)
    if existeUploads:
        os.mkdir(f'{dir_path}/uploads/')

    nombreArchivo = f'{nombreuuid}-{file.filename}'

    f = open(f'{dir_path}/uploads/{nombreArchivo}', 'wb')
    content = await file.read()
    f.write(content)
    extension = os.path.splitext(nombreArchivo)[1]

    if extension == '.pdf':
        paginas = contar_paginas_pdf(f'{dir_path}/uploads/{nombreArchivo}')
        print(paginas)
        image_conversion(f'{dir_path}/uploads/{nombreArchivo}',
                         f'{dir_path}/pdf/', paginas)
    nombrePdf = f'{dir_path}/pdf/{str(uuid.uuid4())}.pdf'
    print('NOMBRE ARCHIVO',nombreArchivo)
    transform_ocr(f'{dir_path}/pdf/image_converted.jpg', nombrePdf)
    print('CREATINGGGGGGGGGGGGG', nombrePdf)
    pdf = open(nombrePdf, 'rb')
    pdfRead = pdf.read()
    pdfBAse64 = binascii.b2a_base64(pdfRead, newline=False).decode('utf-8')
    return {
        'finalizado': True,
        'mensaje': 'OK',
        'datos': pdfBAse64
    }

