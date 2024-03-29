/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {
        document.getElementById("fillColor").onclick = fillColor;
        document.getElementById("readData").onclick = readData;
        document.getElementById("write").onclick = writeData;
        document.getElementById("scaleType").onclick = scaleType;
        console.log("onReady")
        // document.getElementById("app-body").style.display = "flex";
        // document.getElementById("run").onclick = run;
    }
    // console.log("NotReady")
    // document.getElementById("test").onclick = writeToCells(2, 6, 1, 1, "hehe")
});
export function test() {
    console.log("hejjhe")

}
//大中小规模判断
export async function scaleType() {
    let typeColumnIndex = document.getElementById("typeColumnIndex").value * 1 - 1; //写入数据列
    console.log(typeof (typeColumnIndex))
    console.log(typeColumnIndex)
    // let rulesSheetName = `"大中小分类标准"`
    let oriTypeColumn = document.getElementById("oriTypeColumn").value;  //原始表矿种在第几列
    let oriScaleOfConstrcution = document.getElementById("oriScaleOfConstrcution").value //原始表矿山规模第几列
    // try {
    await Excel.run(async (context) => {
        //操作当前表格
        const ws = context.workbook.worksheets.getActiveWorksheet()//获取当前工作表
        const orginalTypes = ws.getUsedRange()//获取当前工作表的占用范围
        orginalTypes.load("values")//获取当前表格值

        //操作分类标准表格
        const rulesSheet = context.workbook.worksheets.getItem("大中小分类标准")//获取“大中小分类标准”表
        let rules = rulesSheet.getUsedRange()//获取分类标准表格占用范围
        rules.load("values")//获取分类标准表格值

        await context.sync();
        let orginT = orginalTypes.values
        let ruleBase = rules.values
        // console.log(ruleBase)
        orginT.shift()//去掉表头数据
        ruleBase.shift()//去掉表头数据

        // console.log(ruleBase)
        // console.log(orginalTypes.values)
        for (let x of orginT) {
            for (let y of ruleBase) {
                // console.log(x[`${oriTypeColumn - 1}`])
                let checker = y.includes(x[`${oriTypeColumn - 1}`])
                // console.log(checker)
                if (checker === true) {
                    if (x[`${oriScaleOfConstrcution - 1}`] < y[1]) {
                        // console.log(orginT.indexOf(x) + 1)
                        // console.log(typeColumnIndex)
                        writeToCells((orginT.indexOf(x) + 1), typeColumnIndex, 1, 1, "小型")
                    } else if (x[`${oriScaleOfConstrcution - 1}`] > y[2]) {
                        // console.log((orginT.indexOf(x) + 1) + "&" + (typeColumnIndex))
                        writeToCells(orginT.indexOf(x) + 1, typeColumnIndex, 1, 1, "大型")
                    } else {
                        // console.log((orginT.indexOf(x) + 1) + "&" + (typeColumnIndex))
                        writeToCells((orginT.indexOf(x) + 1), typeColumnIndex, 1, 1, "中型")
                    }
                }
            }
        }

    })
}
export async function writeData() {
    // try {
    await Excel.run(async (context) => {
        // const range = context.workbook.getSelectedRanges();
        const range = context.workbook.worksheets.getActiveWorksheet().getRange("f2:f3")
        // const range = ws.getRange("A1:A2");
        // range.load("values")
        range.values = [[44], [88]]
        await context.sync();
        // console.log(range.values)
    })
    // } catch (error) {
    //     console.error(error)
    // }
}



export async function fillColor() {
    try {
        await Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            // Read the range address
            range.load("address");
            // Update the fill color
            range.format.fill.color = "yellow";

            await context.sync();
            console.log(`The range address was ${range.address}.`);
        });
    } catch (error) {
        console.error(error);
    }
}
export async function readData() {
    Excel.run(async (context) => {
        // const ws = context.workbook.worksheets.getActiveWorksheet()
        const range = context.workbook.getSelectedRange();
        range.load("address")
        range.load("values")
        await context.sync()
        console.log("range.values1 + ", range.values)
        console.log("range.address1 + ", range.address)
        const newResults = range.values.map(r => {
            return r.map(c => {
                return "Hello" + c;
            })
        })
        range.values = newResults;
        console.log("range.values2 + ", range.values)
        console.log("range.address2 + ", range.address)
        return context;
    })
}
//数据写入，与原数据比对，不一致的写入并加黄色
async function writeToCells(sr, sc, rc, cc, type) {
    // console.log(typeof (sc))
    // console.log(typeof (rc))
    // console.log(typeof (cc))
    console.log(`${sr} + ${sc} + ${rc} + ${cc} + ${type}`)
    await Excel.run(async (context) => {
        const range = context.workbook.worksheets.getActiveWorksheet().getRangeByIndexes(sr, sc, rc, cc)
        range.load("values")
        await context.sync();
        if (range.values != type) {
            range.values = [[type]]
            range.format.fill.color = "yellow"
            await context.sync();
        }
    })
}