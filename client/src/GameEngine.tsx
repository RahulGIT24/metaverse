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
  // const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const [player, setPlayer] = useState<any>();
  const [map, setMap] = useState<any>();
  const speed = 10;
  // const pressedkeys: { [key: string]: boolean } = {};
  const pressedKeys = useRef<Map<string, boolean>>(new Map<string, boolean>());
  useEffect(() => {
    function loadImages() {
      mapImageRef.current.src = "/village_map.jpeg";
      playerImageRef.current.src = "/texture_wood.jpg";

      mapImageRef.current.onload = () => {
        console.log("Map image loaded.");
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
        playerImageRef.current.onload = () => {
          imageLoadRef.current = true;
          console.log("Player image loaded.");
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
        };
      };
    }

    loadImages();
    draw();
  }, []);

  const draw = () => {
    // console.log('first')
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log('here')
    if (map) {
      // console.log("mapdrawn ")
      map.draw(ctx);
    }
    if (player) {
      //console.log('player drawn')
      player.draw(ctx);
    }

    //requestAnimationFrame(draw);
  };

  const handleKeypress = (e: KeyboardEvent) => {
    //console.log("here", map);
    /*  if (map || player) {
      console.log("he");
      const speed = 10;
      switch (e.code) {
        case "KeyW":
          if (!(map.position.y > canvasRef.current.height / 2 - player.width))
            map.position.y += speed;
          break;
        case "KeyS":
          if (!(map.position.y < -canvasRef.current.height / 2 + player.width))
            map.position.y -= speed;
          break;
        case "KeyA":
          if (!(map.position.x > canvasRef.current.width / 2 - player.width))
            map.position.x += speed;
          break;
        case "KeyD":
          if (!(map.position.x < -canvasRef.current.width / 2 + player.width))
            map.position.x -= speed;
          break;
        default:
          break;
      }
    } */

    pressedKeys.current.set(`${e.code}`, true);
  };

  function handleKeyUp(e: KeyboardEvent) {
    pressedKeys.current.set(`${e.code}`, false);
  }

  function updateMovement() {
    //  console.log('1')
    console.log(pressedKeys.current.get("KeyD"));
    if (
      pressedKeys.current.get("KeyW") &&
      !(map.position.y > canvasRef.current.height / 2 - player.height)
    ) { 
      console.log("pressed w");
      map.position.y += speed; 
    }
    if (
      pressedKeys.current.get("KeyS") &&
      !(map.position.y < -canvasRef.current.height / 2 + player.height)
    ) {
      map.position.y += speed;
    }
    if (
      pressedKeys.current.get("KeyA") &&
      !(map.position.x > canvasRef.current.width / 2 - player.width)
    ) {
      map.position.x += speed;
    }
    if (
      pressedKeys.current.get("KeyD") &&
      !(map.position.x < -canvasRef.current.width / 2 + player.width)
    ) {
      map.position.x += speed;
    }
    draw();
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeypress);
    document.addEventListener("keydown", handleKeyUp);

    return () => {
     // document.removeEventListener("keydown", handleKeypress);
     // document.removeEventListener("keydown", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    function gameLoop() {
      draw();
      updateMovement();
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  }, [map, player]); //in future controlled by addition of players or removal....more the number of players more number of draws

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
