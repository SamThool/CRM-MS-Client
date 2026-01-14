"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { get, put } from "@/lib/api";

export default function SettingsPage() {
  const { companyId } = useSelector((state) => state.auth.auth);

  const [settings, setSettings] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  /** Fetch settings */
  const fetchSettings = async () => {
    try {
      const res = await get(`/setting?companyId=${companyId}`);
      setSettings(res?.data || {});
    } catch (err) {
      toast.error("Settings not found. Please contact admin.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (companyId) fetchSettings();
  }, [companyId]);

  /** Toggle single setting */
  const toggleSetting = async (key, value) => {
    setSavingKey(key);
    try {
      await put("/setting", {
        companyId,
        key,
        value: !value,
      });

      setSettings((prev) => ({
        ...prev,
        [key]: !value,
      }));

      toast.success("Setting updated");
    } catch (err) {
      toast.error("Failed to update setting");
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  /** Group settings dynamically by first camelCase word */
  const groupedSettings = {};
  Object.entries(settings).forEach(([key, value]) => {
    // Extract first word from camelCase key
    const match = key.match(/^[a-z]+|[A-Z][a-z]*/g);
    const prefix = match ? match[0] : key;
    const groupName = prefix.charAt(0).toUpperCase() + prefix.slice(1); // Capitalize

    if (!groupedSettings[groupName]) groupedSettings[groupName] = {};
    groupedSettings[groupName][key] = value;
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Field Settings</h1>
      </div>

      {Object.entries(groupedSettings).map(([groupName, groupFields]) => (
        <Card key={groupName} className="border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{groupName}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {Object.entries(groupFields).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-muted/40 transition"
              >
                <span className="font-medium">{formatLabel(key)}</span>

                <Switch
                  checked={Boolean(value)}
                  disabled={savingKey === key}
                  onCheckedChange={() => toggleSetting(key, value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Convert camelCase / PascalCase to readable label */
function formatLabel(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
