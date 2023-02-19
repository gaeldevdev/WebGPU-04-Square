export function createRenderPass(commandEncoder: GPUCommandEncoder,
                                    pipeline: GPURenderPipeline,
                                    textureView: GPUTextureView,
                                    vertexBuffer: GPUBuffer,
                                    colorBuffer: GPUBuffer,
                                    backgroundColor: any,
    ): GPURenderPassEncoder{
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: backgroundColor,
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    return renderPass
}