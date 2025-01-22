import React, { useEffect, useRef, useState } from "react";

class Sprite {
  public position: { x: number; y: number };
  public img: any;
  public width: any;
  public height: any;

  constructor({
    dimensions,
    position,
    image,
  }: {
    dimensions: { w: number; h: number };
    position: { x: number; y: number };
    image: any;
  }) {
    this.position = position;
    this.img = image;
    this.width = dimensions.w;
    this.height = dimensions.h;
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.img) {
      // console.log('draw')

      context.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
}

export default function GameEngine() {
  const canvasRef = useRef<any>(null);
  const mapImageRef = useRef<HTMLImageElement>(new Image());
  const playerImageRef = useRef<HTMLImageElement>(new Image());
  const imageLoadRef = useRef<boolean>(false);
  const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const [player, setPlayer] = useState<any>();
  const [map, setMap] = useState<any>();

  useEffect(() => {
    mapImageRef.current.src = "/map.svg";
    playerImageRef.current.src = "/texture_wood.jpg";

    mapImageRef.current.onload = () => console.log("Map image loaded.");
    playerImageRef.current.onload = () => {
      imageLoadRef.current = true;
      console.log("Player image loaded.");
    };
    setPlayer(
      new Sprite({
        dimensions: {
          w: 40,
          h: 40,
        },
        position: {
          x: canvasRef.current.width / 2,
          y: canvasRef.current.height / 2,
        },
        image: playerImageRef.current,
      })
    );
    setMap(
      new Sprite({
        dimensions: {
          w: 1270,
          h: 700,
        },
        position: {
          x: 0,
          y: 0,
        },
        image: mapImageRef.current,
      })
    );
    //  draw();
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //  console.log('here')
    if (map) {
      map.draw(ctx);
      console.log('map is drawn')
    }
    if (player) {
      console.log('player isndrawn')
      player.draw(ctx);
    }

    requestAnimationFrame(draw);
  };

  const handleKeypress = (e: KeyboardEvent) => {
    /* if(map&&player&&(-map.position.x>canvasRef.current.width-player.width||map.position.y>canvasRef.current.height)){
    console.log("boundary");
    map.pos.x+=1000;
    
    return ;
  } */
    /*   if (map) { 
    console.log(map, '\n', canvasRef.current);
  } */
    if (map) {
      const speed = 10;

      if (e.code === "KeyW" && !(map.position.y > canvasRef.current.height)) {
        map.position.y += speed;
      }
      if (e.code === "KeyS" && !(map.position.y < -canvasRef.current.height)) {
        map.position.y -= speed;
      }
      if (e.code === "KeyA" && !(map.position.x > canvasRef.current.width)) {
        map.position.x += speed;
      }
      if (e.code === "KeyD" && !(map.position.x < -canvasRef.current.width)) {
        map.position.x -= speed;
      }

      draw(); // Redraw immediately after keypress
    }
  };

  useEffect(() => {
    draw();
  }, [mapPos,]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeypress);
    return () => {
      // document.removeEventListener("keydown", handleKeypress);
    };
  }, []);

  return (
    <>
      <canvas
        className="  "
        id="game"
        height={700}
        width={1270}
        ref={canvasRef}
      />
      a
    </>
  );
}
