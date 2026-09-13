import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SREScene() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!window.WebGLRenderingContext || reduced) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 8
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6)); host.appendChild(renderer.domElement)
    const group = new THREE.Group(); scene.add(group)
    const material = new THREE.MeshBasicMaterial({ color: 0x9af2be })
    const nodes = [[-2.7,0,0],[-1.3,1.8,.2],[1.2,1.5,-.3],[2.8,0,0],[1.2,-1.6,.2],[-1.2,-1.5,-.2]]
    nodes.forEach(([x,y,z]) => { const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(.12,1),material); mesh.position.set(x,y,z); group.add(mesh) })
    const lines = nodes.map(([x,y,z]) => { const points=[new THREE.Vector3(0,0,0),new THREE.Vector3(x,y,z)]; const geo=new THREE.BufferGeometry().setFromPoints(points); const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x9af2be,transparent:true,opacity:.48})); group.add(line); return line })
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.65,2),new THREE.MeshBasicMaterial({color:0xff795d,wireframe:true})); group.add(core)
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}; resize(); window.addEventListener("resize",resize)
    let frame=0; const animate=()=>{frame=requestAnimationFrame(animate);const t=performance.now()/1000;group.rotation.y=t*.12;group.rotation.x=Math.sin(t*.25)*.08;core.rotation.z=t*.35;nodes.forEach((_,i)=>{const node=group.children[i] as THREE.Mesh;node.scale.setScalar(1+Math.sin(t*2+i)*.22)});lines.forEach((line,i)=>{(line.material as THREE.LineBasicMaterial).opacity=.25+Math.sin(t*1.5+i)*.12});renderer.render(scene,camera)};animate()
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",resize);renderer.dispose();host.removeChild(renderer.domElement)}
  },[])
  return <div ref={ref} className="sre-scene" aria-label="Animated three dimensional reliability topology" role="img" />
}
