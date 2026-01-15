"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { post } from "@/lib/api";

const emptyRow = (connectionId) => ({
  name: "",
  number: "",
  email: "",
  roleId: "",
  designationId: "",
  connectionId,
});

const AddContact = forwardRef(
  ({ connectionId, roles = [], designations = [] }, ref) => {
    const [contacts, setContacts] = useState([emptyRow(connectionId)]);

    const updateRow = (index, field, value) => {
      const updated = [...contacts];
      updated[index][field] = value;
      setContacts(updated);
    };

    const addRow = () => {
      setContacts([...contacts, emptyRow(connectionId)]);
    };

    const removeRow = (index) => {
      setContacts(contacts.filter((_, i) => i !== index));
    };

    // 👇 THIS is what parent will call
    useImperativeHandle(ref, () => ({
      async save() {
        const payload = contacts.filter((c) => c.name || c.number || c.email);

        if (!payload.length) return;

        await post("/contact/bulk", { contacts: payload });

        // reset after save
        setContacts([emptyRow(connectionId)]);
      },
    }));

    return (
      <div className="space-y-4">
        {contacts.map((row, index) => (
          <div
            key={index}
            className="flex flex-wrap gap-3 items-center border rounded-md p-3"
          >
            <Input
              placeholder="Name"
              value={row.name}
              onChange={(e) => updateRow(index, "name", e.target.value)}
              className="w-full sm:w-[180px]"
            />

            <Input
              placeholder="Number"
              value={row.number}
              onChange={(e) => updateRow(index, "number", e.target.value)}
              className="w-full sm:w-[150px]"
            />

            <Input
              placeholder="Email"
              value={row.email}
              onChange={(e) => updateRow(index, "email", e.target.value)}
              className="w-full sm:w-[220px]"
            />

            <Select
              value={row.roleId}
              onValueChange={(v) => updateRow(index, "roleId", v)}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r._id} value={r._id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={row.designationId}
              onValueChange={(v) => updateRow(index, "designationId", v)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeRow(index)}
              disabled={contacts.length === 1}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </Button>
      </div>
    );
  }
);

AddContact.displayName = "AddContact";
export default AddContact;
