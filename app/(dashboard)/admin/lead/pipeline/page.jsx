"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { get, put } from "@/lib/api";
import { useSelector } from "react-redux";

const Page = () => {
  const { companyId } = useSelector((state) => state.auth.auth);
  const [columns, setColumns] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [leads, setLeads] = useState([]);
  const dragItemRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragOverColumn = useRef(null);

  const getStatusById = (id) => {
    return statuses.find((status) => status._id === id) || null;
  };

  const updateLeadStatus = async (leadId, statusId) => {
    try {
      await put("/lead/update-status", {
        leadId,
        leadStatusId: statusId,
      });
    } catch (error) {
      console.error("Failed to update lead status", error);

      // Optional rollback (recommended)
      FetchData();
    }
  };

  const FetchData = async () => {
    try {
      const statusResponse = await get(`/lead-status?companyId=${companyId}`);
      const leadResponse = await get(`/lead?companyId=${companyId}`);

      const statuses = statusResponse || [];
      const leads = leadResponse.data || [];

      // Initialize columns
      const formattedColumns = statuses.reduce((acc, status) => {
        acc[status._id] = [];
        return acc;
      }, {});

      // Push leads into their respective columns
      leads.forEach((lead) => {
        const statusId = lead?.leadStatusId?._id;

        if (statusId && formattedColumns[statusId]) {
          formattedColumns[statusId].push(lead);
        }
      });

      setLeads(leads);
      setStatuses(statuses);
      setColumns(formattedColumns);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  // Desktop drag handlers
  const handleDragStart = (item, columnId) => {
    setDraggedItem(item);
    setDraggedFromColumn(columnId);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId) => {
    if (!draggedItem || !draggedFromColumn) return;

    // Prevent dropping in the same column
    if (draggedFromColumn === targetColumnId) {
      setDraggedItem(null);
      setDraggedFromColumn(null);
      setIsDragging(false);
      return;
    }

    updateLeadStatus(draggedItem._id, targetColumnId);

    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };

      // Remove from source column - use _id for comparison
      newColumns[draggedFromColumn] = newColumns[draggedFromColumn].filter(
        (item) => item._id !== draggedItem._id
      );

      // Add to target column - check if item doesn't already exist
      const itemExists = newColumns[targetColumnId].some(
        (item) => item._id === draggedItem._id
      );

      if (!itemExists) {
        newColumns[targetColumnId] = [
          ...newColumns[targetColumnId],
          draggedItem,
        ];
      }

      return newColumns;
    });

    setDraggedItem(null);
    setDraggedFromColumn(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedFromColumn(null);
    setIsDragging(false);
  };

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e, item, columnId) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };

    setDraggedItem(item);
    setDraggedFromColumn(columnId);
    setIsDragging(true);

    dragItemRef.current = e.currentTarget;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !draggedItem) return;

    e.preventDefault();
    const touch = e.touches[0];

    // Find element at touch position
    const elementAtPoint = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    // Find the closest column
    const columnElement = elementAtPoint?.closest("[data-column-id]");
    if (columnElement) {
      const columnId = columnElement.getAttribute("data-column-id");
      dragOverColumn.current = columnId;

      // Visual feedback
      const allColumns = document.querySelectorAll("[data-column-id]");
      allColumns.forEach((col) => {
        col.classList.remove("ring-2", "ring-primary");
      });
      columnElement.classList.add("ring-2", "ring-primary");
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || !draggedItem || !draggedFromColumn) {
      setIsDragging(false);
      dragOverColumn.current = null;

      if (targetColumnId && targetColumnId !== draggedFromColumn) {
        setColumns((prevColumns) => {
          const newColumns = { ...prevColumns };

          newColumns[draggedFromColumn] = newColumns[draggedFromColumn].filter(
            (item) => item._id !== draggedItem._id
          );

          newColumns[targetColumnId] = [
            ...newColumns[targetColumnId],
            draggedItem,
          ];

          return newColumns;
        });

        // ✅ BACKEND UPDATE
        updateLeadStatus(draggedItem._id, targetColumnId);
      }

      // Remove visual feedback
      const allColumns = document.querySelectorAll("[data-column-id]");
      allColumns.forEach((col) => {
        col.classList.remove("ring-2", "ring-primary");
      });
      return;
    }

    const targetColumnId = dragOverColumn.current;

    // Only move if dropping in a different column
    if (targetColumnId && targetColumnId !== draggedFromColumn) {
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };

        // Remove from source column - use _id for comparison
        newColumns[draggedFromColumn] = newColumns[draggedFromColumn].filter(
          (item) => item._id !== draggedItem._id
        );

        // Add to target column - check if item doesn't already exist
        const itemExists = newColumns[targetColumnId].some(
          (item) => item._id === draggedItem._id
        );

        if (!itemExists) {
          newColumns[targetColumnId] = [
            ...newColumns[targetColumnId],
            draggedItem,
          ];
        }

        return newColumns;
      });
    }

    // Remove visual feedback
    const allColumns = document.querySelectorAll("[data-column-id]");
    allColumns.forEach((col) => {
      col.classList.remove("ring-2", "ring-primary");
    });

    setDraggedItem(null);
    setDraggedFromColumn(null);
    setIsDragging(false);
    dragOverColumn.current = null;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Pipeline
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Long press and drag tasks between columns
        </p>
      </div>

      <div className="overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex space-x-3 md:space-x-4 min-w-min">
          {Object.keys(columns).map((columnId, index) => (
            <div
              key={columnId}
              className="flex-shrink-0 transition-all"
              data-column-id={columnId}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(columnId)}
            >
              <Card className="w-72 md:w-80 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg">
                      {getStatusById(columnId)?.leadStatus || columnId}
                    </CardTitle>
                    <Badge variant="secondary">
                      {columns[columnId].length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-3 pr-2">
                    {columns[columnId].map((item) => (
                      <Card
                        key={item._id}
                        draggable
                        onDragStart={() => handleDragStart(item, columnId)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) =>
                          handleTouchStart(e, item, columnId)
                        }
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                          backgroundColor: getStatusById(columnId)?.colorCode,
                        }}
                        className={`cursor-move touch-none select-none hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 ${
                          isDragging && draggedItem?._id === item._id
                            ? "opacity-50 scale-95"
                            : ""
                        }`}
                      >
                        <CardContent className="p-3 md:p-4">
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-lg font-medium text-foreground">
                              {item.ClientName}
                            </p>
                            <p className="text-xs ">{item.PhoneNumber}</p>
                            <p className="text-xs ">{item.email}</p>
                            <p className="text-xs ">
                              {item.City} {item.Pincode} {item.State}{" "}
                              {item.Country}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {columns[columnId].length === 0 && (
                      <Card className="border-2 border-dashed">
                        <CardContent className="flex items-center justify-center h-32 p-4">
                          <p className="text-muted-foreground text-sm">
                            Drop items here
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
