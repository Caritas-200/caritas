import React, { useState, useEffect } from "react";

interface DonationFormProps {
  benefitForm: {
    donationType: string[];
    description: string;
    cost: string;
  };
  setBenefitForm: React.Dispatch<React.SetStateAction<any>>;
  isCustomCost: boolean;
  setIsCustomCost: React.Dispatch<React.SetStateAction<boolean>>;
  customCost: string;
  setCustomCost: React.Dispatch<React.SetStateAction<string>>;
}

const donationOptions = [
  "Monetary Donations",
  "Food and Water",
  "Clothing",
  "Medical Supplies",
  "Hygiene Kits",
  "Shelter Materials",
  "Volunteering Services",
  "Educational Supplies",
  "Pet Supplies",
  "Transportation Assistance",
];

const DonationForm: React.FC<DonationFormProps> = ({
  benefitForm,
  setBenefitForm,
  isCustomCost,
  setIsCustomCost,
  customCost,
  setCustomCost,
}) => {
  const [isMonetaryDonationSelected, setIsMonetaryDonationSelected] = useState(
    benefitForm.donationType.includes("Monetary Donations")
  );

  useEffect(() => {
    setIsMonetaryDonationSelected(
      benefitForm.donationType.includes("Monetary Donations")
    );
  }, [benefitForm.donationType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "cost") {
      const isCustom = value === "custom";
      setIsCustomCost(isCustom);
      setBenefitForm((prev: any) => ({ ...prev, cost: isCustom ? "" : value }));
    } else {
      setBenefitForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (option: string) => {
    setBenefitForm((prev: { donationType: string[] }) => {
      const newDonationType = prev.donationType.includes(option)
        ? prev.donationType.filter((item) => item !== option)
        : [...prev.donationType, option];
      return { ...prev, donationType: newDonationType };
    });
  };

  const handleCustomCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCost(e.target.value);
    setBenefitForm((prev: any) => ({ ...prev, cost: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b pb-2">
        <label
          htmlFor="donationType"
          className="block text-sm font-medium mb-2"
        >
          Type of Benefits
        </label>
        <div
          id="donationType"
          className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-md shadow-inner"
        >
          {donationOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="donationType"
                value={option}
                checked={benefitForm.donationType.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b pb-2">
        <label htmlFor="description" className="block text-sm font-medium pb-2">
          Description (Optional)
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={benefitForm.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>

      {isMonetaryDonationSelected && (
        <div>
          <label htmlFor="cost" className="block text-sm font-medium pb-2">
            Monetary Value
          </label>
          <select
            id="cost"
            name="cost"
            value={benefitForm.cost}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded mb-2"
          >
            <option value="">Select a range</option>
            <option value="1001-5000">1,001 - 5,000</option>
            <option value="5001-10000">5,001 - 10,000</option>
            <option value="10001-15000">10,001 - 15,000</option>
            <option value="15001-20000">15,001 - 20,000</option>
            <option value="custom">Custom</option>
          </select>
          {isCustomCost && (
            <div>
              <label htmlFor="customCost" className="block text-sm font-medium">
                Enter Custom Value
              </label>
              <input
                type="number"
                id="customCost"
                value={customCost}
                onChange={handleCustomCostChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationForm;
