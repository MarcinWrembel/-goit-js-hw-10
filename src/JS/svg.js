
// function createSvg(el) {
//   const svgElements = ['up2', 'down3'];
//   const xlinks = 'http://www.w3.org/1999/xlink';
//   const nameSpace = 'http://www.w3.org/2000/svg';

//   svgElements.forEach(e => {
//     const newSvg = document.createElementNS(nameSpace, 'svg');
//     const use = document.createElementNS(nameSpace, 'use');

//     newSvg.classList.add('country-list__svg');

//     use.setAttributeNS(xlinks, 'xlink:href', `./img/icons.svg#up2`);
//     use.setAttribute('width', '18');
//     use.setAttribute('height', '18');

//     el.appendChild(newSvg);
//     newSvg.appendChild(use);
//   });
// }

// export function createSvg(el) {
//     const xlinks = 'http://www.w3.org/1999/xlink'
//     const ns ="http://www.w3.org/2000/svg";
  
//       const newSvg = document.createElementNS(ns, 'svg');
//       const newUse = document.createElementNS(ns, 'use');
//     //   newSvg.setAttribute('viewBox', '0 0 18 18');
//       newUse.setAttribute('width', 18);
//       newUse.setAttribute('height', 18);
//       newUse.setAttribute('href', `./img/icons.svg#up2`);
//       newSvg.appendChild(newUse);
//       newSvg.classList.add('country-list__svg');
//       el.appendChild(newSvg);

//   }



// function createSvg(el) {
//   const svgElements = ['up2'];
//   const ns ="http://www.w3.org/2000/svg";

//   svgElements.forEach(e => {
//     const newSvg = document.createElementNS(ns, 'svg');
//     newSvg.classList.add('country-list__svg');
//     el.appendChild(newSvg);
//     newSvg.insertAdjacentHTML(
//       'afterbegin',
//       `<use width="18" height="18" xlink:href="#${e}"></use>`
//     );
//   });
// }