import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface ProgressStage {
  label: string;
  value: number;
  color: string;
}

interface ProgressBarProps {
  stages: ProgressStage[];
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ stages, total }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          {stages.map((stage, index) => {
            const width = total > 0 ? (stage.value / total) * 100 : 0;
            return (
              <div
                key={index}
                className="h-full float-left"
                style={{
                  width: `${width}%`,
                  backgroundColor: stage.color,
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          {stages.map((stage, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span>{stage.label}</span>
              </div>
              <span className="font-medium">{stage.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBar;
