function fitImage(parentWidth, parentHeight, childWidth, childHeight) {
    const childRatio = childWidth / childHeight
    const parentRatio = parentWidth / parentHeight
    let width = parentWidth
    let height = parentHeight
    if (childRatio < parentRatio) {
        height = width / childRatio
    } else {
        width = height * childRatio
    }
    return {
        width,
        height,
        x: (parentWidth - width) * .5,
        y: (parentHeight - height) * .5
    }
}