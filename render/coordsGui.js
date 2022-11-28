import {
    AdditiveConstraint,
    animate,
    Animations,
    CenterConstraint,
    ChildBasedMaxSizeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    FillConstraint,
    MaxConstraint,
    ScissorEffect,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIImage,
    UIWrappedText,
    UIMultilineTextInput,
    UIText,
    WindowScreen,
  } from "../../Elementa"

// stylla made 2 lines of code (gamer)
const Color = Java.type("java.awt.Color")
const URL = Java.type("java.net.URL")
let ScreenW = Renderer.screen.getWidth(),
 ScreenH = Renderer.screen.getHeight()

function coordsWindow(row, column, title, command, desc, image=false, alternateText="")
{
    const coordWindow = new UIBlock(new Color(0, 0, 0, 0.5)) // 320 960 
        .setX(((ScreenW/3*(column))-ScreenW/3.5).pixels())
        .setY((ScreenH/2*(row-1)+ScreenH/10.8).pixels())
        .setWidth((ScreenW/4.5).pixels())
        .setHeight((ScreenH/3.7).pixels())
        .onMouseClick(() => {
            ChatLib.command(command, true)
        })
    new UIText(title, false)
        .setX(new CenterConstraint())
        .setY((2).pixels())
        .setTextScale((2).pixels())
        .setColor(new ConstantColorConstraint(Color.GREEN.darker()))
        .setChildOf(coordWindow)
    if(image == true)
    {
        new UIWrappedText(alternateText)
            .setX((12).pixels())
            .setY((25).pixels())
            .setWidth((ScreenW/5).pixels())
            .setTextScale((1).pixels())
            .setColor(new ConstantColorConstraint(Color.WHITE))
            .setChildOf(coordWindow)
        new UIImage.ofURL(new URL(desc))
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new CenterConstraint(), (4).pixels()))
            .setWidth((ScreenW/5).pixels())
            .setHeight((ScreenH/5).pixels())
            .setChildOf(coordWindow)
    }
    else
    {
        new UIWrappedText(desc)
            .setX((2).pixels())
            .setY((25).pixels())
            .setWidth((ScreenW/4.5).pixels())
            .setTextScale((1).pixels())
            .setColor(new ConstantColorConstraint(Color.WHITE))
            .setChildOf(coordWindow)
    }

    return coordWindow
}

export function openCoordsGui()
{
    ScreenW = Renderer.screen.getWidth()
    ScreenH = Renderer.screen.getHeight()
    const CoordsGui = new JavaAdapter(WindowScreen, {
        init() {
            coordsWindow(1, 1, "Spiral", "cw spiral toggle", "https://i.imgur.com/dyL30GD.png", true, "Do /cw spiral to see image. (image isn't loading.)").setChildOf(this.getWindow())
            coordsWindow(1, 2, "Throne", "cw throne toggle", "https://i.imgur.com/7BWzO1c.jpg", true, "Go back of throne. (image isn't loading)").setChildOf(this.getWindow())
            coordsWindow(1, 3, "Yog", "cw yog toggle", "https://i.imgur.com/DojoypL.jpg", true, "Go to the leftmost corner of the topaz crystal facing bal close to bal. (image isn't loading)").setChildOf(this.getWindow())
            coordsWindow(2, 1, "Divans", "cw divans toggle", "https://i.imgur.com/bkC6yp3.jpg", true, "Go to the middle of jade crystal. (image isn't loading)").setChildOf(this.getWindow())
            new UIText("Click box to enable/disable.")
                .setX(new CenterConstraint())
                .setY((ScreenH-ScreenH/12).pixels())
                .setTextScale((2).pixels())
                .setColor(Color.WHITE)
                .setChildOf(this.getWindow())
        },
    })
    CoordsGui.init()
    GuiHandler.openGui(CoordsGui)
}