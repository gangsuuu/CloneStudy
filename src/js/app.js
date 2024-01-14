import { gsap } from "gsap";
export default function () {
  const items = document.querySelectorAll('.item');
  const spans = document.querySelectorAll('.hero-copy span');
  const container = document.querySelector('.container');
  const numberOfItems = items.length;
  const angleIncrement = (2 * Math.PI) / numberOfItems;
  const radius = 300;
  let currentAngle = 0;
  let isMouseOverSpan = false;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  /**
   * 이미지로드
   * 1. set basePath
   * 2. bast + (images name) + number(index number) + 'jpg' 
   */
  const basePath = './public/assets/';
  items.forEach((item, index) => {
    let img = document.createElement("img");
    img.src = basePath + "img" + (index + 1) + ".png";
    img.alt = "Image" + (index + 1);
    item.appendChild(img);
  })


  /**
   * 갤러리 업데이트
   * 
   */
  const updateGallery = (mouseX, mouseY, show = true) =>{
    //현재 마우스 위치에서 
    console.log(mouseX,mouseY)
    targetX = mouseX - container.getBoundingClientRect().left;
    targetY = mouseY - container.getBoundingClientRect().top;
    //마우스 이동시 가속도
    currentX += (targetX - currentX) * 0.1
    currentY += (targetY - currentY) * 0.1


    items.forEach(function (item,index){
      //index별 각도구하기
      const angle = currentAngle + index * angleIncrement;
      //반지금 300을 기준으로 x값, y값 찾기
      const x1 = radius * Math.cos(angle) - item.offsetWidth / 2;
      const y1 = radius * Math.sin(angle) - item.offsetHeight / 2
      const x = currentX + x1;
      const y = currentY + y1;
      
      gsap.to(item, {
        x: x,
        y: y,
        opacity : show ? 1 :0,
        duration: 0.5,
        ease : "power1.out"
      })
    })

  }
  spans.forEach((span) =>{
    span.addEventListener('mouseenter', (e)=>{
      isMouseOverSpan = true;
      console.log(e.clientX,e.clientY, 'e')
      updateGallery(e.clientX, e.clientY, true);
    })

    //item 위치 찾기
    span.addEventListener('mousemove', (e)=>{
      if(isMouseOverSpan){
        targetX = e.clientX - window.innerWidth/2
        targetY = e.clientY - window.innerHeight/2
      }
    })
    span.addEventListener('mouseleave', () =>{
      isMouseOverSpan = false,
      updateGallery(0,0, false)
    })
  })


  /**
   * 지속적인 angnle update
   * gsap.ticker -> requestAnimationFrame처럼 계속 실행되는 gsap의 애니메이션
   * angle을 계속 변화 시켜주며 360가 되었을 때,  360을 빼는 방법으로 다시 0으로 만들어줌
   * currentAngle = 0으로 했을 경우 360과 0사이에 어색함이 발생 할 수 있는 문제를 해결함
   */
  gsap.ticker.add(()=> {
    currentAngle += 0.005;
    if(currentAngle > 2*Math.PI){
      currentAngle -= 2* Math.PI;
    }
    if(isMouseOverSpan) {
      updateGallery(targetX, targetY, true)
    }
  })

  /**
   * 선택된 text 외 명도를 낮춰서 text를 강조
   */
  document.querySelectorAll(".hero-copy span").forEach((span) => {
    span.addEventListener("mouseenter", ()=>{
      span.parentNode.style.color = "#545454"
    })
    span.addEventListener("mouseleave", ()=>{
      span.parentNode.style.color = "#fff"
    })
  })
}