import { Skeleton } from "./engine";

(async () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const game = new Skeleton(canvas, {
    debug: true,
  });

  const textures = [
    {
      label: "realDJH",
      url: "http://salmondaze.gitee.io/djhsm/assets/DJH.png",
    },
    {
      label: "DJH",
      url:
        "https://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=11b6956df493dd5eaba4d4c649829523",
    },
    {
      label: "DJHcry",
      url:
        "https://t7.baidu.com/it/u=3204887199,3790688592&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=08e3a2384ee14f63629e4e64e6586d08",
    },
    {
      label: "food",
      url:
        "https://t9.baidu.com/it/u=1307125826,3433407105&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=89240e9d675af2537322304ca56e67d5",
    },
    {
      label: "mt",
      url:
        "https://t9.baidu.com/it/u=2268908537,2815455140&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=8fc552ca5c6c8cba5239ea0ff0bd29f1",
    },
  ];
  await game.loadTexture(textures, (index, count) => {
    console.log((index / count) * 100 + "%");
  });

  game.setVariable("count", 10);
  game.addEvent("mousedown", (e, engine, instanceSet) => {
    console.log(e);
    const ball = game.getVariable("count");
    engine.setInstance({
      name: `ball${ball + 1}`,
      pos: {
        initVX: Math.ceil(Math.random() * 3),
        initVY: Math.ceil(Math.random() * 3),
        initX: (e as MouseEvent).offsetX,
        initY: (e as MouseEvent).offsetY,
      },
      behavior: ballBehavior,
      initState: {
        color: `${Math.floor(Number(Math.random() * 255)).toString(
          16
        )}${Math.floor(Number(Math.random() * 255)).toString(16)}${Math.floor(
          Number(Math.random() * 255)
        ).toString(16)}`,
      },
    });
    game.setVariable("count", ball + 1);
  });

  game.addEvent("mousemove", (e: MouseEvent, engine, instanceSet) => {
    const pointer = engine.getInstance("pointer");
    pointer.x = e.offsetX;
    pointer.y = e.offsetY;
  });
  const ballBehavior = {
    action: (instance, engine) => {
      const p = game.getInstance("pointer");
      if (instance.x > 790 || instance.x < 10) instance.vx = -instance.vx;
      if (instance.y > 590 || instance.y < 10) instance.vy = -instance.vy;
      if (
        p.x < instance.x + p.state.radius &&
        p.x > instance.x - p.state.radius &&
        p.y > instance.y - p.state.radius &&
        p.y < instance.y + p.state.radius
      ) {
        game.destoryInstance(instance.name);
        game.setInstanceState(p.name, "radius", p.state.radius + 0.1);
        console.log("进来了");
      }

      instance.x += instance.vx;
      instance.y += instance.vy;
    },
    paint: (instance, engine) => {
      const { ctx } = engine;
      ctx.beginPath();
      ctx.fillStyle = instance.state.color;
      ctx.arc(instance.x, instance.y, 2, 0, Math.PI * 2, false);
      ctx.fill();
    },
  };

  const pointerBehavior = {
    action: (instance, engine, time) => {},
    paint: (instance, engine) => {
      const { ctx } = engine;
      ctx.beginPath();
      ctx.drawImg;
      ctx.fillStyle = instance.color;
      ctx.arc(
        instance.x,
        instance.y,
        instance.state.radius,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    },
  };
  for (let i = 0; i < game.getVariable("count"); i++) {
    game.setInstance({
      name: `ball${i}`,
      pos: {
        initVX: Math.ceil(Math.random() * 3),
        initVY: Math.ceil(Math.random() * 3),
        initX: Math.floor(Math.random() * 750 + 30),
        initY: Math.floor(Math.random() * 550 + 30),
      },
      behavior: ballBehavior,
      initState: {
        radius: 1,
      },
    });

    game.setInstanceState(
      `ball${i}`,
      "color",
      `${Math.floor(Number(Math.random() * 255)).toString(16)}${Math.floor(
        Number(Math.random() * 255)
      ).toString(16)}${Math.floor(Number(Math.random() * 255)).toString(16)}`
    );
  }
  game.addLayer()
  game.setInstance({
    name: `pointer`,
    pos: {
      initVX: 0,
      initVY: 0,
      initX: 400,
      initY: 300,
    },
    behavior: pointerBehavior,
    initState: {
      radius: 10,
    },
    layerIndex: game.lastLayerIndex 
  });

  // canvas.addEventListener("mousemove", (e) => {
  //   game.setInstanceState("pointer", "x", e.offsetX);
  //   game.setInstanceState("pointer", "y", e.offsetY);
  // });
  let id;
  function draw() {
    game.startDraw();
  }
  draw();
})();
