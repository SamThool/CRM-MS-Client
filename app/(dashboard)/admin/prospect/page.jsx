"use client";

import { useEffect, useState } from "react";
import { del, get, post } from "@/lib/api";
import {
  Briefcase,
  CalendarIcon,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

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

import AddProspect from "./AddProspect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const { companyId } = useSelector((state) => state.auth.auth);
  const setting = useSelector((state) => state.setting.setting);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ---------------- FETCH CLIENTS ---------------- */
  const fetchClients = async () => {
    try {
      const res = await get("/prospect");
      setClients(res?.data || []);
    } catch (err) {
      console.error("Fetch clients failed", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleMakeLead = async (client) => {
    // call API → move/create lead
    await get(`/prospect/make-lead/${client}`);
    fetchClients();
    toast.success("Prospect Moved to Lead successfully");
  };

  const handleMakeClient = async (client) => {
    // call API → move/create client
    await get(`/prospect/make-client/${client}`);
    fetchClients();
    toast.success("Prospect Moved to Client successfully");
  };

  const handleDelete = async (client) => {
    await del(`/prospect/${client}`);
    fetchClients();
    toast.success("Prospect deleted successfully");
  };

  const closeDialog = () => {
    setOpen(false);
    fetchClients();
  };

  const handleEdit = (client) => {
    setEdit(true);
    setEditData(client);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Prospects</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prospect
        </Button>
      </div>

      {/* TABLE */}
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
            {clients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No clients found
                </TableCell>
              </TableRow>
            )}
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell className="text-center">
                  {client.ClientName}
                </TableCell>
                <TableCell className="text-center">{client?.email}</TableCell>
                <TableCell className="text-center">
                  {client.PhoneNumber}
                </TableCell>
                <TableCell className="text-center">
                  {client.leadStatusId?.leadStatus || "-"}
                </TableCell>
                <TableCell className="space-x-2 text-center">
                  <TooltipProvider>
                    {/* Edit */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    {/* Make Lead */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMakeLead(client._id)}
                        >
                          <UserPlus className="h-4 w-4 text-blue-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Lead</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Make Client */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMakeClient(client._id)}
                        >
                          <Briefcase className="h-4 w-4 text-green-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Client</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(client._id)}
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

      <AddProspect
        open={open}
        onOpenChange={closeDialog}
        editData={editData}
        edit={edit}
      />

      {/* ADD CLIENT DIALOG */}
    </div>
  );
}
