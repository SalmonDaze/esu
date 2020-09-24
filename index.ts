import { Skeleton } from "./engine";

(async () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const game = new Skeleton(ctx);

  const textures = [
    {
      label: 'realDJH',
      url: 'http://salmondaze.gitee.io/djhsm/assets/DJH.png'
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
const count = 100
  for (let i = 0; i < count; i++) {
    game.setInstance(
      "ball" + i,
      {
        initVX: Math.ceil(Math.random() * 3),
        initVY: Math.ceil(Math.random() * 3),
        initX: Math.floor(Math.random() * 800),
        initY: Math.floor(Math.random() * 600),
      },
      'realDJH'
    );
  }

  function draw() {
    game.draw((instanceSet) => {
      for(let i = 0 ; i < count ; i++) {
        const ball = instanceSet.get("ball" + i);
      if (ball.x > 790 || ball.x < 10) ball.vx = -ball.vx;
      if (ball.y > 590 || ball.y < 10) ball.vy = -ball.vy;
      }
      
    });
    window.requestAnimationFrame(draw);
  }
  draw();
})();
