"use client";

import { useEffect, useState } from "react";
import { get, post, put } from "@/lib/api";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldGroup, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const AddProspect = ({ open, onOpenChange, editData, edit }) => {
  const [loading, setLoading] = useState(false);
  const { companyId } = useSelector((state) => state.auth.auth);
  const setting = useSelector((state) => state.setting.setting);
  const [leadTypes, setLeadTypes] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadRefferences, setLeadRefferences] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [formData, setFormData] = useState({
    ClientName: "",
    email: "",
    PhoneNumber: "",
    AlternativePhoneNumber: "",
    AlternativeEmail: "",
    EmergencyContactPerson: "",
    EmergencyContactNumber: "",
    OfficeAddress: "",
    City: "",
    State: "",
    Country: "",
    Pincode: "",
    GSTNumber: "",
    PanNumber: "",
    Website: "",
    startDate: "",
    endDate: "",
    leadTypeId: null,
    leadSourceId: null,
    leadReferenceId: null,
    leadStatusId: null,
    sectorId: null,
    sizeId: null,
    budget: "",
    revenue: "",
    renewalDate: null,
    companyId,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMasters = async () => {
    const types = await get(`/lead-type?companyId=${companyId}`);
    const statuses = await get(`/lead-status?companyId=${companyId}`);
    const refferences = await get(`/lead-reference?companyId=${companyId}`);
    const sources = await get(`/lead-source?companyId=${companyId}`);

    const sizes = await get(`/size?companyId=${companyId}`);
    const sectors = await get(`/sector?companyId=${companyId}`);
    setSizes(sizes || []);
    setSectors(sectors || []);
    setLeadRefferences(refferences);
    setLeadSources(sources);
    setLeadTypes(types);
    setLeadStatuses(statuses);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (edit) {
        // Call API to update prospect
        await put(`/prospect/${editData._id}`, formData);
      } else {
        await post("/prospect", formData);
      }
      onOpenChange();
      setFormData({
        ClientName: "",
        email: "",
        PhoneNumber: "",
        AlternativePhoneNumber: "",
        AlternativeEmail: "",
        EmergencyContactPerson: "",
        EmergencyContactNumber: "",
        OfficeAddress: "",
        sizeId: null,
        sectorId: null,
        leadTypeId: null,
        leadSourceId: null,
        leadReferenceId: null,
        leadStatusId: null,
        budget: "",
        revenue: "",
        renewalDate: null,
        City: "",
        State: "",
        Country: "",
        Pincode: "",
        GSTNumber: "",
        PanNumber: "",
        Website: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Create client failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
    if (edit) {
      setFormData({
        ...editData,
        sizeId: editData.sizeId?._id || null,
        sectorId: editData.sectorId?._id || null,
        leadTypeId: editData.leadTypeId?._id || null,
        leadSourceId: editData.leadSourceId?._id || null,
        leadReferenceId: editData.leadReferenceId?._id || null,
        leadStatusId: editData.leadStatusId?._id || null,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[85vw] h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Prospect</DialogTitle>
        </DialogHeader>

        {/* BASIC INFO */}
        <FieldGroup>
          <FieldTitle>Basic Information</FieldTitle>

          <div className="flex flex-wrap gap-4">
            <Input
              name="ClientName"
              placeholder="Client Name"
              value={formData.ClientName}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />

            {setting.prospectEmail && (
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full sm:w-[calc(50%-0.5rem)]"
              />
            )}

            <Input
              name="PhoneNumber"
              placeholder="Phone Number"
              value={formData.PhoneNumber}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />

            <Input
              name="AlternativePhoneNumber"
              placeholder="Alternative Phone"
              value={formData.AlternativePhoneNumber}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />

            <Input
              name="AlternativeEmail"
              placeholder="Alternative Email"
              value={formData.AlternativeEmail}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />
          </div>
        </FieldGroup>

        <FieldSeparator />

        <FieldGroup>
          <FieldTitle>Lead Information</FieldTitle>

          <div className="flex flex-wrap gap-4">
            <Select
              value={formData.leadTypeId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, leadTypeId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Lead Type" />
              </SelectTrigger>
              <SelectContent>
                {leadTypes?.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.leadType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formData.leadSourceId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, leadSourceId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Lead Source" />
              </SelectTrigger>
              <SelectContent>
                {leadSources?.map((source) => (
                  <SelectItem key={source._id} value={source._id}>
                    {source.leadSource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.leadReferenceId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, leadReferenceId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Lead Reference" />
              </SelectTrigger>
              <SelectContent>
                {leadRefferences?.map((ref) => (
                  <SelectItem key={ref._id} value={ref._id}>
                    {ref.leadReference}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.leadStatusId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, leadStatusId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Lead Status" />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses?.map((ref) => (
                  <SelectItem key={ref._id} value={ref._id}>
                    {ref.leadStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Client Size */}
            <Select
              value={formData.sizeId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, sizeId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes?.map((ref) => (
                  <SelectItem key={ref._id} value={ref._id}>
                    {ref.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Client Sector */}
            <Select
              value={formData.sectorId || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, sectorId: value })
              }
            >
              <SelectTrigger className="w-full sm:w-[calc(33.333%-0.75rem)]">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors?.map((ref) => (
                  <SelectItem key={ref._id} value={ref._id}>
                    {ref.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Budget */}
            <Input
              type="number"
              placeholder="Budget"
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
              value={formData.budget || ""}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
            />
            {/* Revenue */}
            <Input
              type="number"
              placeholder="Revenue"
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
              value={formData.revenue || ""}
              onChange={(e) =>
                setFormData({ ...formData, revenue: e.target.value })
              }
            />
            {/* Renewal Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[calc(33.333%-0.75rem)] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.renewalDate
                    ? new Date(formData.renewalDate).toLocaleDateString()
                    : "Select Renewal Date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={
                    formData.renewalDate
                      ? new Date(formData.renewalDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    setFormData({
                      ...formData,
                      renewalDate: date?.toISOString(),
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </FieldGroup>

        <FieldSeparator />
        <FieldGroup>
          <FieldTitle>Address</FieldTitle>

          <div className="flex flex-wrap gap-4">
            <Input
              name="OfficeAddress"
              placeholder="Office Address"
              value={formData.OfficeAddress}
              onChange={handleChange}
              className="w-full"
            />

            <Input
              name="City"
              placeholder="City"
              value={formData.City}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />

            <Input
              name="State"
              placeholder="State"
              value={formData.State}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />

            <Input
              name="Country"
              placeholder="Country"
              value={formData.Country}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />

            <Input
              name="Pincode"
              placeholder="Pincode"
              value={formData.Pincode}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />
          </div>
        </FieldGroup>

        <FieldSeparator />
        <FieldGroup>
          <FieldTitle>Tax & Business</FieldTitle>

          <div className="flex flex-wrap gap-4">
            <Input
              name="GSTNumber"
              placeholder="GST Number"
              value={formData.GSTNumber}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />

            <Input
              name="PanNumber"
              placeholder="PAN Number"
              value={formData.PanNumber}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />

            <Input
              name="Website"
              placeholder="Website"
              value={formData.Website}
              onChange={handleChange}
              className="w-full sm:w-[calc(33.333%-0.75rem)]"
            />
          </div>
        </FieldGroup>

        <FieldSeparator />
        <FieldGroup>
          <FieldTitle>Emergency Contact</FieldTitle>

          <div className="flex flex-wrap gap-4">
            <Input
              name="EmergencyContactPerson"
              placeholder="Emergency Contact Person"
              value={formData.EmergencyContactPerson}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />

            <Input
              name="EmergencyContactNumber"
              placeholder="Emergency Contact Number"
              value={formData.EmergencyContactNumber}
              onChange={handleChange}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            />
          </div>
        </FieldGroup>

        {/* <FieldSeparator /> */}

        {/* CONTRACT PERIOD */}
        {/* <FieldGroup>
            <FieldTitle>Contract Period</FieldTitle>

            <div className="flex flex-wrap gap-4">
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full sm:w-[calc(50%-0.5rem)]"
              />

              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full sm:w-[calc(50%-0.5rem)]"
              />
            </div>
          </FieldGroup> */}

        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? edit
                ? "Updating..."
                : "Saving..."
              : edit
              ? "Update Prospect"
              : "Save Prospect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProspect;
