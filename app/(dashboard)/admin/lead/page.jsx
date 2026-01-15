"use client";

import { useEffect, useState } from "react";
import { del, get } from "@/lib/api";
import { Briefcase, Pencil, Plus, Trash2, UserPlus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import AddLead from "./AddLead";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const { companyId } = useSelector((state) => state.auth.auth);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await get("/lead");
      setLeads(res?.data || []);
    } catch (err) {
      console.error("Fetch leads failed", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // const handleMakeProspect = async (leadId) => {
  //   await get(`/lead/make-prospect/${leadId}`);
  //   fetchLeads();
  //   toast.success("Lead Moved to Prospect successfully");
  // };

  const handleMakeClient = async (leadId) => {
    await get(`/lead/make-client/${leadId}`);
    fetchLeads();
    toast.success("Lead Moved to Client successfully");
  };

  const handleDelete = async (leadId) => {
    await del(`/lead/${leadId}`);
    fetchLeads();
    toast.success("Lead deleted successfully");
  };

  const closeDialog = () => {
    setOpen(false);
    setEdit(false);
    setEditData(null);
    fetchLeads();
  };

  const handleEdit = (lead) => {
    setEdit(true);
    setEditData(lead);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Leads</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Client</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No leads found
                </TableCell>
              </TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="text-center">{lead.ClientName}</TableCell>
                <TableCell className="text-center">{lead?.email}</TableCell>
                <TableCell className="text-center">
                  {lead.PhoneNumber}
                </TableCell>
                <TableCell className="text-center">
                  {lead.leadStatusId?.leadStatus || "-"}
                </TableCell>
                <TableCell className="space-x-2 text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(lead)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMakeProspect(lead._id)}
                        >
                          <UserPlus className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Prospect</p>
                      </TooltipContent>
                    </Tooltip> */}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMakeClient(lead._id)}
                        >
                          <Briefcase className="h-4 w-4 text-green-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Client</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(lead._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddLead
        open={open}
        onOpenChange={closeDialog}
        editData={editData}
        edit={edit}
      />
    </div>
  );
}
