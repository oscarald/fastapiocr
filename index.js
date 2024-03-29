//---------------------------------------------------------------------------------------
// Copyright (c) 2001-2021 by PDFTron Systems Inc. All Rights Reserved.
// Consult legal.txt regarding legal and license information.
//---------------------------------------------------------------------------------------


const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('../LicenseKey/LicenseKey');

((exports) => {
  'use strict';

  //---------------------------------------------------------------------------------------
  // The following sample illustrates how to use OCR module
  //---------------------------------------------------------------------------------------
  exports.runOCRTest = () => {
    const main = async () => {
      try {

        PDFNet.addResourceSearchPath('../../lib/');
        if (!(await PDFNet.OCRModule.isModuleAvailable())) {
          console.log('\nUnable to run OCRTest: PDFTron SDK OCR module not available.');
          console.log('---------------------------------------------------------------');
          console.log('The OCR module is an optional add-on, available for download');
          console.log('at http://www.pdftron.com/. If you have already downloaded this');
          console.log('module, ensure that the SDK is able to find the required files');
          console.log('using the PDFNet.addResourceSearchPath() function.\n');

          return;
        }

        // Relative path to the folder containing test files.
        const input_path = '../TestFiles/OCR/';
        const output_path = '../TestFiles/Output/';

        //--------------------------------------------------------------------------------
        // Example 1) Process image without specifying options, default language - English - is used
        try {

          // A) Setup empty destination doc
          const doc = await PDFNet.PDFDoc.create();
          await doc.initSecurityHandler();

          // B) Run OCR on the .png with options
          await PDFNet.OCRModule.imageToPDF(doc, input_path + 'psychomachia_excerpt.png');

          // C) check the result
          await doc.save(output_path + 'psychomachia_excerpt.pdf', 0);

          console.log('Example 1: psychomachia_excerpt.png');

        } catch (err) {
          console.log(err);
        }

        //--------------------------------------------------------------------------------
        // Example 2) Process document using multiple languages
        try {
          // A) Setup empty destination doc
          const doc = await PDFNet.PDFDoc.create();
          await doc.initSecurityHandler();

          // B) Setup options with multiple target languages, English will always be considered as secondary language
          const opts = new PDFNet.OCRModule.OCROptions();
          opts.addLang('rus');
          opts.addLang('deu');

          // C) Run OCR on the .jpg with options
          await PDFNet.OCRModule.imageToPDF(doc, input_path + 'multi_lang.jpg', opts);

          // D) check the result
          await doc.save(output_path + 'multi_lang.pdf', 0);

          console.log('Example 2: multi_lang.jpg');
        } catch (err) {
          console.log(err);
        }

        //--------------------------------------------------------------------------------
        // Example 3) Process a .pdf specifying a language - German - and ignore zone comprising a sidebar image 
        try {
          // A) Open the .pdf document
          const doc = await PDFNet.PDFDoc.createFromFilePath(input_path + 'german_kids_song.pdf');
          doc.initSecurityHandler();

          // B) Setup options with a single language and an ignore zone
          const opts = new PDFNet.OCRModule.OCROptions();
          opts.addLang('deu');

          const ignore_zones = [];
          ignore_zones.push(new PDFNet.Rect(424, 163, 493, 730));
          opts.addIgnoreZonesForPage(ignore_zones, 1);

          // C) Run OCR on the .pdf with options
          await PDFNet.OCRModule.processPDF(doc, opts);

          // D) check the result
          await doc.save(output_path + 'german_kids_song.pdf', 0);

          console.log('Example 3: german_kids_song.pdf');
        } catch (err) {
          console.log(err);
        }

        //--------------------------------------------------------------------------------
        // Example 4) Process multipage tiff with text/ignore zones specified for each page, optionally provide English as the target language
        try {
          // A) Setup empty destination doc
          const doc = await PDFNet.PDFDoc.create();
          await doc.initSecurityHandler();

          // B) Setup options with a single language plus text/ignore zones
          const opts = new PDFNet.OCRModule.OCROptions();
          opts.addLang('eng');

          var ignore_zones = [];
          // ignore signature box in the first 2 pages
          ignore_zones.push(new PDFNet.Rect(1492, 56, 2236, 432));
          opts.addIgnoreZonesForPage(ignore_zones, 1);

          ignore_zones = [];
          ignore_zones.push(new PDFNet.Rect(1492, 56, 2236, 432));
          opts.addIgnoreZonesForPage(ignore_zones, 2);

          // can use a combination of ignore and text boxes to focus on the page area of interest,
          // as ignore boxes are applied first, we remove the arrows before selecting part of the diagram
          ignore_zones = [];
          ignore_zones.push(new PDFNet.Rect(992, 1276, 1368, 1372));
          opts.addIgnoreZonesForPage(ignore_zones, 3);


          const text_zones = [];
          // we only have text zones selected in page 3

          // select horizontal BUFFER ZONE sign
          text_zones.push(new PDFNet.Rect(900, 2384, 1236, 2480));
          // select right vertical BUFFER ZONE sign
          text_zones.push(new PDFNet.Rect(1960, 1976, 2016, 2296));
          // select Lot No.
          text_zones.push(new PDFNet.Rect(696, 1028, 1196, 1128));

          // select part of the plan inside the BUFFER ZONE
          text_zones.push(new PDFNet.Rect(428, 1484, 1784, 2344));
          text_zones.push(new PDFNet.Rect(948, 1288, 1672, 1476));
          opts.addTextZonesForPage(text_zones, 3);

          // C) Run OCR on the .tif with options
          await PDFNet.OCRModule.imageToPDF(doc, input_path + 'bc_environment_protection.tif', opts);

          // D) check the result
          await doc.save(output_path + 'bc_environment_protection.pdf', 0);

          console.log('Example 4: bc_environment_protection.tif');
        } catch (err) {
          console.log(err);
        }

        //--------------------------------------------------------------------------------
        // Example 5) Alternative workflow for extracting OCR result JSON, postprocessing (e.g., removing words not in the dictionary or filtering special
        // out special characters), and finally applying modified OCR JSON to the source PDF document 
        try {
          // A) Open the .pdf document
          const doc = await PDFNet.PDFDoc.createFromFilePath(input_path + 'zero_value_test_no_text.pdf');
          await doc.initSecurityHandler();

          // B) Run OCR on the .pdf with default English language
          const json = await PDFNet.OCRModule.getOCRJsonFromPDF(doc);

          // C) Post-processing step (whatever it might be)
          console.log('Have OCR result JSON, re-applying to PDF ');

          // D) Apply potentially modified OCR JSON to the PDF
          await PDFNet.OCRModule.applyOCRJsonToPDF(doc, json);

          // E) Check the result
          await doc.save(output_path + 'zero_value_test_no_text.pdf', 0);

          console.log('Example 5: extracting and applying OCR JSON from zero_value_test_no_text.pdf');
        } catch (err) {
          console.log(err);
        }

        //--------------------------------------------------------------------------------
        // Example 6) The postprocessing workflow has also an option of extracting OCR results in XML format, similar to the one used by TextExtractor
        try {

          // A) Setup empty destination doc
          const doc = await PDFNet.PDFDoc.create();
          await doc.initSecurityHandler();

          // B) Run OCR on the .tif with default English language, extracting OCR results in XML format. Note that
          // in the process we convert the source image into PDF. We reuse this PDF document later to add hidden text layer to it.
          const xml = await PDFNet.OCRModule.getOCRXmlFromImage(doc, input_path + 'physics.tif');

          // C) Post-processing step (whatever it might be)
          console.log('Have OCR result XML, re-applying to PDF');

          // D) Apply potentially modified OCR XML to the PDF
          await PDFNet.OCRModule.applyOCRXmlToPDF(doc, xml);

          // E) Check the result
          await doc.save(output_path + 'physics.pdf', 0);

          console.log('Example 6: extracting and applying OCR XML from physics.tif');
        } catch (err) {
          console.log(err);
        }


        //--------------------------------------------------------------------------------
        // Example 7) Resolution can be manually set, when DPI missing from metadata or is wrong
        try {
          // A) Setup empty destination doc
          const doc = await PDFNet.PDFDoc.create();
          await doc.initSecurityHandler();

          // B) Setup options with a text zone
          const opts = new PDFNet.OCRModule.OCROptions();

          const text_zones = [];
          text_zones.push(new PDFNet.Rect(140, 870, 310, 920));
          opts.addTextZonesForPage(text_zones, 1);

          // C) Manually override DPI
          opts.addDPI(100)

          // D) Run OCR on the .jpg with options
          await PDFNet.OCRModule.imageToPDF(doc, input_path + 'corrupted_dpi.jpg', opts);

          // E) check the result
          await doc.save(output_path + 'corrupted_dpi.pdf', 0);

          console.log('Example 7: converting image with corrupted resolution metadata corrupted_dpi.jpg to pdf with searchable text');
        } catch (err) {
          console.log(err);
        }

        console.log('Done.');
      } catch (err) {
        console.log(err);
      }
    };
    PDFNet.runWithCleanup(main, PDFTronLicense.Key).catch(function(error) {
      console.log('Error: ' + JSON.stringify(error));
    }).then(function(){ return PDFNet.shutdown(); });
  };
  exports.runOCRTest();
})(exports);
// eslint-disable-next-line spaced-comment
//# sourceURL=OCRTest.js