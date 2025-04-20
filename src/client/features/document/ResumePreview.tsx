"use client";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import PersonalInfo from "./preview/personal-info";
import Summary from "./preview/summary";
import Experience from "./preview/experience";
import Education from "./preview/education";
import Skill from "./preview/skill";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableResumeItem from "./SortableResumeItem";
import Project from "./preview/project";
import Certificate from "./preview/certificate";

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeContext();
  const [elements, setElements] = useState([
    {
      id: 1,
      SortableElement: PersonalInfo,
    },
    {
      id: 2,
      SortableElement: Summary,
    },
    {
      id: 3,
      SortableElement: Experience,
    },
    {
      id: 4,
      SortableElement: Project,
    },
    {
      id: 5,
      SortableElement: Education,
    },
    {
      id: 6,
      SortableElement: Skill,
    },
    {
      id: 7,
      SortableElement: Certificate,
    },
  ]);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div
      id="resume-preview-id"
      className={cn(`
    shadow-lg bg-white w-full flex-[1.02]
    h-full p-10 !font-open-sans
    dark:border dark:bg-card 
    dark:border-b-gray-800 
    dark:border-x-gray-800
    `)}
      style={{
        borderTop: `13px solid ${resumeInfo?.themeColor}`,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={elements.map((element) => element.id)}
          strategy={verticalListSortingStrategy}
        >
          {elements.map((element) => (
            <SortableResumeItem id={element.id} key={element.id}>
              {
                <element.SortableElement
                  isLoading={isLoading}
                  resumeInfo={resumeInfo}
                />
              }
            </SortableResumeItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ResumePreview;
