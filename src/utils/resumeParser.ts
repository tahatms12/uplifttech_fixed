/* eslint-disable @typescript-eslint/no-explicit-any */
const PDF_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
const PDF_WORKER_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
const JSZIP_SRC = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

declare global {
  interface Window {
    pdfjsLib?: any;
    JSZip?: any;
  }
}

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      if ((existing as HTMLScriptElement).readyState === 'complete') {
        resolve();
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

const loadPdfJs = async () => {
  if (typeof window.pdfjsLib !== 'undefined') {
    return window.pdfjsLib;
  }
  await loadScript(PDF_SRC);
  if (typeof window.pdfjsLib === 'undefined') {
    throw new Error('PDF parser unavailable');
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  return window.pdfjsLib;
};

const loadJsZip = async () => {
  if (typeof window.JSZip !== 'undefined') {
    return window.JSZip;
  }
  await loadScript(JSZIP_SRC);
  if (typeof window.JSZip === 'undefined') {
    throw new Error('JSZip unavailable');
  }
  return window.JSZip;
};

const extractContactInfo = (text: string) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/\+?\d[\d\s().-]{7,}\d/);
  const lines = text.split(/\n|\r/).map((line) => line.trim()).filter(Boolean);
  const nameCandidate = lines[0] && lines[0].split(' ').length <= 5 ? lines[0] : '';
  return {
    fullName: nameCandidate,
    email: emailMatch?.[0] ?? '',
    phone: phoneMatch?.[0] ?? ''
  };
};

const parsePdf = async (file: File) => {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 5); pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  return extractContactInfo(text);
};

const parseDocx = async (file: File) => {
  const JSZip = await loadJsZip();
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentXml = await zip.file('word/document.xml')?.async('string');
  if (!documentXml) {
    return { fullName: '', email: '', phone: '' };
  }
  const text = documentXml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  return extractContactInfo(text);
};

export const parseResume = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (file.type === 'application/pdf' || extension === 'pdf') {
    return parsePdf(file);
  }
  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    return parseDocx(file);
  }
  const text = await file.text();
  return extractContactInfo(text);
};
