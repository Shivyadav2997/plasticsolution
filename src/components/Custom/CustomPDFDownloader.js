import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";

const CustomPDFDownloader = ({ rootElementId, downloadFileName, inputRef }) => {
  const inpRef = useRef(inputRef.current);
  const downloadPdfDocument = () => {
    const input = document.getElementById(rootElementId);
    const mainDiv = document.getElementById("mainDiv");
    const width = 1206;
    const height = 298;

    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");

    //   const pdf = new jsPDF({
    //     unit: "px",
    //     orientation: "landscape",
    //     format: [height, width],
    //   });
    //   //   pdf.internal.pageSize.height = input.clientHeight;
    //   //   pdf.internal.pageSize.width = input.clientWidth;
    //   //   var width = pdf.internal.pageSize.getWidth();
    //   //   var height = pdf.internal.pageSize.getHeight();
    //   pdf.addImage(imgData, "JPEG", 0, 0, width, height);
    //   pdf.save(`${downloadFileName}.pdf`);
    // });
    const pdf = new jsPDF();
    pdf.html(inpRef.current, {
      async callback(pdf) {
        await pdf.save(`${downloadFileName}.pdf`);
      },
    });
  };

  return <button onClick={downloadPdfDocument}>Download Pdf</button>;
};

export default CustomPDFDownloader;
