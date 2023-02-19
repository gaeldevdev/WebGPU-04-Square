import './style.css'
import { GPU } from './gpu'
import { createGPUBuffer } from './gpuBuffer';
import { createPipeline } from './pipeline';
import { createRenderPass } from './renderpass';
import shader from './shader.wgsl?raw'; 

const BACKGROUND = { r: 0.25, g: 0.25, b: 0.3, a: 1.0 }

const gpu = new GPU()
let message = gpu.getStatusMessage()

const createSquare = async () => {
    if (!gpu.getStatus()) return;

    const device = await gpu.requestDevice()

    const vertexData = new Float32Array([
       -0.5, -0.5, 0, // vertex A
        0.5, -0.5, 0, // vertex B
       -0.5,  0.5, 0, // vertex D
       -0.5,  0.5, 0, // vertex D
        0.5, -0.5, 0, // vertex B
        0.5,  0.5, 0, // vertex C
   ]);

   const colorData = new Float32Array([
        0, 0, 1,    // vertex A: blue
        0, 1, 0,    // vertex B: green
        0, 1, 0,    // vertex D: green
        0, 1, 0,    // vertex D: green
        0, 1, 0,    // vertex B: green
        0, 0, 1     // vertex C: blue
    ]);

    const vertexBuffer = createGPUBuffer(device, vertexData);
    const colorBuffer = createGPUBuffer(device, colorData);

    const pipeline = createPipeline(device, gpu.getFormat(), shader)

    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
    context.configure({
        device: device,
        format: gpu.getFormat(),
        alphaMode:'opaque'
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = createRenderPass(commandEncoder, pipeline, textureView, vertexBuffer, colorBuffer, BACKGROUND);
    let nbOfVertices = vertexData.length / 3
    renderPass.draw(nbOfVertices);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

createSquare();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div><p> ` + message + `</p></div>`
