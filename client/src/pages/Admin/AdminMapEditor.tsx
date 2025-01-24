import React, { MouseEvent, useEffect, useMemo, useState } from "react";
import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import apiCall from "../../utils/apiCall";
import { toast } from "sonner";
import { MapElement } from "../../utils/types";

export default function AdminMapEditor() {
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  const [imageDimensions, setImageDimensions] = useState({
    x: 1270,
    y: 900,
  });
  return (
    <>
      <div className="flex w-screen h-screen">
        <Stage
          width={imageDimensions.x}
          height={imageDimensions.y}
          options={{ background: 0x1099bb }}
        >
            {/* spirtes will be mapped with the elements placed */}
          <Sprite image={bunnyUrl} x={300} y={150} />
          <Sprite image={bunnyUrl} x={500} y={150} />
          <Sprite image={bunnyUrl} x={400} y={200} />
        </Stage>
        <ElementSelector />
      </div>
    </>
  );
}

function ElementSelector() {
  const [elements, setElements] = useState<any[]>();
  useEffect(() => {
    (async () => {
      const fetchData = await apiCall({
        url: "",                 //to be filled after the dragging and sending new element method is made 
        method: "GET",
      });
      if (fetchData.status === 500) {
        toast(fetchData.data.message);
        return;
      } else if (!fetchData) {
        console.log("Element data could not be fetched");
      }
      setElements(fetchData.data);
    })();
  }, []);

  return (
    <>
      <div className="flex h-full w-[30%] bg-red-500 flex-col">
        {elements &&
          elements.map((element: any) => {   
            return <DragableElement element={element} />;
          })}

       
       
      </div>
    </>
  );
}

function DragableElement({element}:{element:MapElement}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

//check if the elements aer in teh map or npot
  useEffect(()=>{ 
    function checkMapInclusion(){ 

    }
    checkMapInclusion
  })
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    console.log(position)
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "100px",
        height: "100px",
        backgroundColor: "black",
        cursor: "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
        <Sprite image={element.url || 'https://pixijs.io/pixi-react/img/bunny.png'} x={element.width} y={element.height} />
    </div>
  );
}
