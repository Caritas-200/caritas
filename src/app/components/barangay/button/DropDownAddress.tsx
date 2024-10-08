import React, { useState } from "react";
import { Address } from "@/app/lib/definitions";

interface DropdownAddressProps {
  address: Address;
  setAddress: (field: keyof Address, value: any) => void;
  regions: any[];
  provinces: any[];
  municipalities: any[];
  barangays: any[];
  errors: { [key: string]: string };
}

const DropdownAddress: React.FC<DropdownAddressProps> = ({
  address,
  setAddress,
  regions,
  provinces,
  municipalities,
  barangays,
  errors,
}) => {
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<any[]>(
    []
  );
  const [filteredBarangays, setFilteredBarangays] = useState<any[]>([]);

  // Unified function for filtering dependent options
  const filterOptions = (type: keyof Address, id: number | null) => {
    switch (type) {
      case "region":
        setFilteredProvinces(
          id ? provinces.filter((p) => p.region_id === id) : []
        );
        setFilteredMunicipalities([]);
        setFilteredBarangays([]);
        setAddress("province", null);
        setAddress("cityMunicipality", null);
        setAddress("barangay", null);
        break;
      case "province":
        setFilteredMunicipalities(
          id ? municipalities.filter((m) => m.province_id === id) : []
        );
        setFilteredBarangays([]);
        setAddress("cityMunicipality", null);
        setAddress("barangay", null);
        break;
      case "cityMunicipality":
        setFilteredBarangays(
          id ? barangays.filter((b) => b.municipality_id === id) : []
        );
        setAddress("barangay", null);
        break;
      default:
        break;
    }
  };

  // Handle changes in dropdowns
  const handleChange = (type: keyof Address, value: string) => {
    const id = parseInt(value, 10) || null;
    const map = {
      region: regions.find((r) => r.region_id === id) || null,
      province: provinces.find((p) => p.province_id === id) || null,
      cityMunicipality:
        municipalities.find((m) => m.municipality_id === id) || null,
      barangay: barangays.find((b) => b.barangay_id === id) || null,
    };

    setAddress(type, map[type]);

    if (type !== "barangay") {
      filterOptions(type, id);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Region Dropdown */}
      <div>
        <label className="mb-1 font-semibold text-gray-800">
          Region <span className="text-red-500">*</span>
        </label>
        <select
          name="region"
          value={address.region?.region_id || ""}
          onChange={(e) => handleChange("region", e.target.value)}
          className="p-2 border border-gray-300 rounded text-gray-700 w-full"
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.region_id} value={region.region_id}>
              {region.region_name}
            </option>
          ))}
        </select>
        {errors["address.region"] && (
          <span className="text-red-500 text-sm">
            {errors["address.region"]}
          </span>
        )}
      </div>

      {/* Province Dropdown */}
      <div>
        <label className="mb-1 font-semibold text-gray-800">
          Province <span className="text-red-500">*</span>
        </label>
        <select
          name="province"
          value={address.province?.province_id || ""}
          onChange={(e) => handleChange("province", e.target.value)}
          className="p-2 border border-gray-300 rounded text-gray-700 w-full"
          disabled={!address.region}
        >
          <option value="">Select Province</option>
          {filteredProvinces.map((province) => (
            <option key={province.province_id} value={province.province_id}>
              {province.province_name}
            </option>
          ))}
        </select>
        {errors["address.province"] && (
          <span className="text-red-500 text-sm">
            {errors["address.province"]}
          </span>
        )}
      </div>

      {/* City/Municipality Dropdown */}
      <div>
        <label className="mb-1 font-semibold text-gray-800">
          City/Municipality <span className="text-red-500">*</span>
        </label>
        <select
          name="cityMunicipality"
          value={address.cityMunicipality?.municipality_id || ""}
          onChange={(e) => handleChange("cityMunicipality", e.target.value)}
          className="p-2 border border-gray-300 rounded text-gray-700 w-full"
          disabled={!address.province}
        >
          <option value="">Select City/Municipality</option>
          {filteredMunicipalities.map((municipality) => (
            <option
              key={municipality.municipality_id}
              value={municipality.municipality_id}
            >
              {municipality.municipality_name}
            </option>
          ))}
        </select>
        {errors["address.cityMunicipality"] && (
          <span className="text-red-500 text-sm">
            {errors["address.cityMunicipality"]}
          </span>
        )}
      </div>

      {/* Barangay Dropdown */}
      <div>
        <label className="mb-1 font-semibold text-gray-800">
          Barangay <span className="text-red-500">*</span>
        </label>
        <select
          name="barangay"
          value={address.barangay?.barangay_id || ""}
          onChange={(e) => handleChange("barangay", e.target.value)}
          className="p-2 border border-gray-300 rounded text-gray-700 w-full"
          disabled={!address.cityMunicipality}
        >
          <option value="">Select Barangay</option>
          {filteredBarangays.map((barangay) => (
            <option key={barangay.barangay_id} value={barangay.barangay_id}>
              {barangay.barangay_name}
            </option>
          ))}
        </select>
        {errors["address.barangay"] && (
          <span className="text-red-500 text-sm">
            {errors["address.barangay"]}
          </span>
        )}
      </div>
    </div>
  );
};

export default DropdownAddress;
