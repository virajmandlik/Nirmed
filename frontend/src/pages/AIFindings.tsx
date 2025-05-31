import React, { useState } from 'react';
import axios from 'axios';

export function AIFindings() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [predictedType, setPredictedType] = useState('');
  const [treatment, setTreatment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    wasteType: '',
    specialInstructions: '',
  });

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setMessage(null);
  }

  async function classifyImage() {
    if (!file) return;
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('image', file);
      console.log('Uploading file:', file.name, file.type);

      const resp = await axios.post<{ label: string; treatment: string | string[] }>(
        'http://localhost:5000/api/classify',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const { label, treatment } = resp.data;
      setPredictedType(label);
      setTreatment(Array.isArray(treatment) ? treatment.join(', ') : treatment);

      setFormData({
        wasteType: label,
        specialInstructions: Array.isArray(treatment)
          ? `Recommended:\n- ${treatment.join('\n- ')}`
          : `Recommended: ${treatment}`,
      });
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function submitRequest() {
    console.log('Submitting Request:', formData);
    setMessage('✅ Request submitted (logged to console). You can connect this to your real endpoint.');
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Waste Disposal Request</h1>

      {message && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Upload and Classification */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Waste Image Analysis</h2>
          
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block mb-2">
                <span className="text-gray-700 font-medium">Upload Waste Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onFileChange} 
                  className="block w-full mt-1 text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </label>
              
              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Waste preview" 
                    className="max-h-64 rounded-lg object-contain border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Classification Button */}
            <button
              onClick={classifyImage}
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all
                ${!file || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze Waste Image'}
            </button>

            {/* Results */}
            {predictedType && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Results</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">Waste Type:</span>
                    <span className="text-gray-800">{predictedType}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 w-32">Treatment:</span>
                    <div className="flex-1">
                      {Array.isArray(treatment) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {treatment.map((item, i) => (
                            <li key={i} className="text-gray-800">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-800">{treatment}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Disposal Request Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Waste Type</label>
              <input
                type="text"
                value={formData.wasteType}
                onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Biomedical Waste, Chemical Waste"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Special Instructions</label>
              <textarea
                rows={8}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any special handling instructions, safety precautions, or additional details about the waste..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Include any relevant details about quantity, storage conditions, or specific hazards.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={submitRequest}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Submit Disposal Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}