import { style } from '@vanilla-extract/css';

export const app = style({
    color: "#022C43",
    padding: "12px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",

})

export const main = style({
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
})

export const textarea = style({
    width: "280px",
    height: "100%",
})

export const json = style({
    width: "350px",
    fontSize: "14px",
    margin: "12px"
})