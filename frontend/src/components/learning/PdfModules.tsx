import React, { useEffect } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { PdfModule } from '../../types/learning';

const PdfModules: React.FC = () => {
  const { 
    pdfModules,
    togglePdfCompletion,
    getPdfProgress,
    initializePdfModules
  } = useStore();

  useEffect(() => {
    const modules: PdfModule[] = [
      { moduleNumber: 1, title: 'Definition, Sources and Characteristics of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-1--definitions-sources-and-characteristics-of-hc-waste.pdf?sfvrsn=1086c03f_4' },
      { moduleNumber: 2, title: 'Health and Environmental Impacts of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-2-health-and-environmental-impacts-of-hc-waste.pdf?sfvrsn=d0c6a7c9_4' },
      { moduleNumber: 3, title: 'International and National HCWM Laws – Legislative, Regulatory and Policy Aspects', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-3---international-and-national-hcwm-laws.pdf?sfvrsn=c2b58bab_4' },
      { moduleNumber: 4, title: 'National Healthcare Waste Management Planning', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-4---national-hcw-management-planning.pdf?sfvrsn=a4b3c48d_4' },
      { moduleNumber: 5, title: 'HCWM Planning in a Healthcare Facility', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-5---hcwm-planning-in-a-health-care-facility.pdf?sfvrsn=9761e19a_4' },
      { moduleNumber: 6, title: 'Occupational Health and Safety', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-6---occupational-health-and-safety.pdf?sfvrsn=aa8e8e44_4' },
      { moduleNumber: 7, title: 'Walkthrough of a Healthcare Facility', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-7---walkthrough-of-a-health-care-facility.pdf?sfvrsn=2796879d_4' },
      { moduleNumber: 8, title: 'Walkthrough of a Healthcare Waste Treatment Facility', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-8---walkthrough-of-a-health-care-waste-treatment-facility.pdf?sfvrsn=8b467a58_4' },
      { moduleNumber: 9, title: 'Classification of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-9---classification-of-health-care-waste.pdf?sfvrsn=dd5e4e84_4' },
      { moduleNumber: 10, title: 'SEGREGATION OF HEALTHCARE WASTE', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-9-and-10---student-guide.pdf?sfvrsn=7574f4c6_4' },
      { moduleNumber: 11, title: 'Healthcare Waste Minimization', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-11---classification-of-health-care-waste.pdf?sfvrsn=ee9ab82d_5' },
      { moduleNumber: 12, title: 'Labeling, Handling and Collection of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-12---labeling-handling-and-collection-of-health-care-waste.pdf?sfvrsn=d8183fcd_2' },
      { moduleNumber: 13, title: 'ON-SITE TRANSPORT AND STORAGE OF HEALTHCARE WASTES', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-13---instructor-s-guide---onsite-transport-and-storage-of-health-care-waste.pdf?sfvrsn=9432aaff_2' },
      { moduleNumber: 14, title: 'Off-site Transport and Storage of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-14---off-site-transport-and-storage-of-health-care-waste.pdf?sfvrsn=db4f438a_2' },
      { moduleNumber: 15, title: 'Non-Incineration Treatment and Disposal of Healthcare Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-15---non-incineration-treatment-and-disposal-of-health-care-waste.pdf?sfvrsn=7c7132d8_2' },
      { moduleNumber: 16, title: 'Incineration of Healthcare Waste and the Stockholm Convention Guidelines', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-16---incineration-of-health-care-waste-and-the-stockholm-convention-guidelines.pdf?sfvrsn=9e98d5c2_2' },
      { moduleNumber: 17, title: 'Management of Specific Infectious Wastes', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-18---management-of-chemical-cytotoxic-pharmaceutical-and-radioactive-wastes.pdf?sfvrsn=c2ac154f_2' },
      { moduleNumber: 18, title: 'Management of Chemical, Cytotoxic, Pharmaceutical and Radioactive Wastes', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-18---management-of-chemical-cytotoxic-pharmaceutical-and-radioactive-wastes.pdf?sfvrsn=c2ac154f_2' },
      { moduleNumber: 19, title: 'Rationale for Mercury-Free Health Care', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-19---rationale-for-mercury-free-health-care.pdf?sfvrsn=cfcc6b28_2' },
      { moduleNumber: 20, title: 'Management and Storage of Mercury Waste', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-20---management-and-storage-of-mercury-waste.pdf?sfvrsn=f1aeb810_2' },
      { moduleNumber: 21, title: 'Non-Mercury Alternatives', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-21---non-mercury-alternatives.pdf?sfvrsn=1c2426fb_2' },
      { moduleNumber: 22, title: 'Contingency Planning and Emergency Response to Healthcare Waste Spill', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-22---contingenca-planing-and-emergency-response-to-health-care-waste-spills.pdf?sfvrsn=2bf8e26_2' },
      { moduleNumber: 23, title: 'Sustainable Development Goals and Health', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-22---contingenca-planing-and-emergency-response-to-health-care-waste-spills.pdf?sfvrsn=2bf8e26_2' },
      { moduleNumber: 24, title: 'Institutionalization of HCWM – Organization, Training, Financing and Quality Improvement', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-24---institutionalization-of-hcwm---organizations-training-financing-and-quality-improvement.pdf?sfvrsn=8a412e94_2' },
      { moduleNumber: 25, title: 'Hospital Hygiene, Infection Control and Healthcare Waste Management', pdfUrl: 'https://cdn.who.int/media/docs/default-source/wash-documents/wash-in-hcf/training-modules-in-health-care-waste-management/module-25---hospital-hygiene-infection-control-and-health-care-waste-management.pdf?sfvrsn=fc978af7_2' },
    ];
    initializePdfModules(modules);
  }, [initializePdfModules]);

  const { completed, total, percentage } = getPdfProgress();

  const handleModuleClick = (index: number) => {
    window.open(pdfModules.modules[index].pdfUrl, '_blank');
    togglePdfCompletion(index);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        📚 Healthcare Waste Management Training Modules
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Completed {completed}/{total}
          </span>
          <span className="text-sm font-semibold text-blue-700">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {pdfModules.modules.map((mod, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-green-600"
                checked={!!pdfModules.completed[index]}
                readOnly
              />
              <button
                onClick={() => handleModuleClick(index)}
                className="text-left text-lg font-medium text-blue-700 hover:underline"
              >
                Module {mod.moduleNumber} – {mod.title}
              </button>
            </div>
            {!!pdfModules.completed[index] && (
              <span className="text-green-600 text-xl">✔️</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfModules; 