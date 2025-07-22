import { useState, useEffect } from "react";

const FilePreview = ({ fileId, fileName, className = "" }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/files/drive-preview/${fileId}`
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setPreviewData(data);
        } else {
          throw new Error("Error al obtener datos del archivo");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      fetchPreviewData();
    }
  }, [fileId]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center p-8 bg-gray-100 rounded-lg ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center p-8 bg-red-50 rounded-lg ${className}`}
      >
        <div className="text-center">
          <svg
            className="h-8 w-8 text-red-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-600 text-sm">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  const renderPreview = () => {
    const { mimeType, previewUrl, imageDirectUrl, name, embedUrl } =
      previewData;

    // Para PDFs
    if (mimeType === "application/pdf") {
      return (
        <div className="w-full h-150 rounded-lg overflow-hidden border border-gray-300">
          <iframe
            src={previewUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`Preview de ${name}`}
            className="w-full h-full"
          />
        </div>
      );
    }

    // Para imágenes
    if (mimeType.startsWith("image/")) {
      return (
        <div className="w-full rounded-lg overflow-hidden border border-gray-300">
          {/* <iframe src={`https://drive.google.com/file/d/${fileId}/preview`} /> */}
          <img
            src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`}
            alt={name}
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div
            style={{ display: "none" }}
            className="flex items-center justify-center p-8 bg-gray-100"
          >
            <div className="text-center">
              <svg
                className="h-12 w-12 text-gray-400 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500">No se pudo cargar la imagen</p>
            </div>
          </div>
        </div>
      );
    }

    // Para documentos de Office (Word, Excel, PowerPoint)
    if (
      mimeType.includes("officedocument") ||
      mimeType.includes("ms-powerpoint") ||
      mimeType.includes("ms-excel") ||
      mimeType.includes("msword") ||
      mimeType.includes("presentation") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("document")
    ) {
      return (
        <div className="w-full h-150 rounded-lg overflow-hidden border border-gray-300">
          <iframe
            src={previewData.officePreviewUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`Preview de ${name}`}
            className="w-full h-full"
          />
        </div>
      );
    }

    // Para videos
    if (mimeType.startsWith("video/")) {
      return (
        <div className="w-full h-150 rounded-lg overflow-hidden border border-gray-300">
          
            <iframe
              src={previewData.previewUrl}
              frameBorder="0"
              width="100%"
              height="100%"
              className="w-full h-full"
            ></iframe>
          
        </div>
      );
    }

    // Para archivos de texto
    if (mimeType.startsWith("text/")) {
      return (
        <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
          <iframe
            src={previewUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`Preview de ${name}`}
            className="w-full h-full"
          />
        </div>
      );
    }

    // Para otros tipos de archivo, mostrar información básica
    return (
      <div className="w-full p-8 bg-gray-50 rounded-lg border border-gray-300">
        <div className="text-center">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-4">Tipo: {mimeType}</p>
          <div className="flex justify-center space-x-3">
            <a
              href={previewData.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Ver en Google Drive
            </a>
            <a
              href={previewData.webContentLink}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Descargar
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {previewData.name}
        </h3>
        <div className="flex space-x-2">
          <a
            href={previewData.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Abrir en Drive
          </a>
          <a
            href={previewData.webContentLink}
            className="text-xs text-green-600 hover:text-green-800"
          >
            Descargar
          </a>
        </div>
      </div>

      {renderPreview()}

      <div className="mt-2 text-xs text-gray-500">
        Tipo: {previewData.mimeType}
      </div>
    </div>
  );
};

export default FilePreview;
