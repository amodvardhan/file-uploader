(this["webpackJsonp@amodv/react-file-uploader-example"]=this["webpackJsonp@amodv/react-file-uploader-example"]||[]).push([[0],{10:function(e,n,t){e.exports=t(19)},11:function(e,n,t){},18:function(e,n,t){},19:function(e,n,t){"use strict";t.r(n);t(11);var r=t(0),a=t.n(r),o=t(7),l=t.n(o),i=t(6),c=t(8),u=t(9);var d=function(e){var n,t,o=e.information,l=e.fileType,d=e.multiple,f=e.buttonLabel,s=e.IconComponent,v=e.enablePreview,m=e.enableProgress,p=e.onFileUpload,g=[],E=0,h=Object(r.useState)([]),b=Object(u.a)(h,2),y=(Object(c.a)(b[0]),b[1]);Object(r.useEffect)((function(){return n=document.getElementById("drop-area"),t=document.getElementById("progress-bar"),L(),P(!0),j(!0),n.addEventListener("drop",O,!1),function(){w(),P(!1),j(!1),n.removeEventListener("drop",O,!1)}}),[]);var L=function(){return["dragenter","dragover","dragleave","drop"].forEach((function(e){var t;null===(t=n)||void 0===t||t.addEventListener(e,I,!1)}))},w=function(){return["dragenter","dragover","dragleave","drop"].forEach((function(e){var t;null===(t=n)||void 0===t||t.removeEventListener(e,I,!1)}))},I=function(e){e.preventDefault(),e.stopPropagation()},P=function(e){["dragenter","dragover"].forEach((function(t){var r,a;e?null===(r=n)||void 0===r||r.addEventListener(t,A,!1):null===(a=n)||void 0===a||a.removeEventListener(t,A,!1)}))},j=function(e){["dragleave","drop"].forEach((function(t){var r,a;e?null===(r=n)||void 0===r||r.addEventListener(t,F,!1):null===(a=n)||void 0===a||a.removeEventListener(t,F,!1)}))},A=function(){var e;null===(e=n)||void 0===e||e.classList.add("highlight")},F=function(){var e;null===(e=n)||void 0===e||e.classList.remove("highlight")},O=function(e){var n=e.dataTransfer.files;x(n)},x=function(e){e=Object(i.a)(e),E=e.length,function(e){t.value=0,g=[];for(var n=e;n>0;n--)g.push(0)}(e.length),e.forEach(B),e.forEach(U)},B=function(e,n){(new XMLHttpRequest).upload.addEventListener("progress",(function(e){C(n,100*e.loaded/e.total||100)})),R(e).then((function(e){var t=[];y((function(n){return t=[].concat(Object(i.a)(n),[e])})),n===E&&p(t)}))},U=function(e){if(e&&"image"===e.type.split("/")[0]){var n=new FileReader;n.readAsDataURL(e),n.onloadend=function(){var e,t=document.createElement("img");t.src=n.result,null===(e=document.getElementById("gallery"))||void 0===e||e.appendChild(t)}}},C=function(e,n){g[e]=n;var r=g.reduce((function(e,n){return e+n}),0)/g.length;t.value=r},R=function(e){return new Promise((function(n,t){var r=new FileReader;r.readAsArrayBuffer(e),r.onload=function(){for(var e=new Uint8Array(r.result),a=[],o=0;o<e.length;o++)a.push(e[o]);a?n(a):t([])}}))};return a.a.createElement("div",{id:"drop-area"},a.a.createElement("div",{className:"my-form"},a.a.createElement("div",null,o),a.a.createElement("div",{style:{textAlign:"center"}},s&&a.a.createElement(s,null)),a.a.createElement("div",null,a.a.createElement("input",{type:"file",id:"fileElem",multiple:d,accept:l,onChange:function(e){var n=e.target.files;E=n?n.length:0;for(var t=0,r=0;r<E;r++)B(n[r],++t);Array.from(n).forEach(U)}}),a.a.createElement("label",{className:"button",htmlFor:"fileElem"},f))),m&&a.a.createElement("progress",{id:"progress-bar",max:"100",value:"0"}),v&&a.a.createElement("div",{id:"gallery"}))},f=(t(18),function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement(d,{information:"Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region",fileType:"image/*",buttonLabel:"Select some files",multiple:!0,enablePreview:!0,enableProgress:!0,IconComponent:function(){return a.a.createElement("strong",null,"Icon Placeholer")},onFileUpload:function(e){return console.log(e)}}))});l.a.render(a.a.createElement(f,null),document.getElementById("root"))}},[[10,1,2]]]);
//# sourceMappingURL=main.30894a01.chunk.js.map