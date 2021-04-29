import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import _ from "lodash"
import "./mytree.ts"
import "./index.less"
const myjson = require('./mytree.json')
export default function IndexPage() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData,setTreeData] = useState<treeModel[]>([]);
  const [treeNodeData,setTreeNodeData] = useState<treeModel[]>([])
  const {treeJson} = myjson
  useEffect(()=>{
    let initData = treeJson
    setTreeData(initData)
  },[]) 
  useEffect(()=>{
    cloneAndChangeToNodeTitle(treeData)
  },[treeData])
  //将treeData的数据克隆后转为ReactNode的样式
  const cloneAndChangeToNodeTitle=(treeData:any)=>{
    let cloneData = _.cloneDeep(treeData)
    changeTitleStrToNode(cloneData,treeData)
    setTreeNodeData(cloneData)
  }
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };
  //修改时将原数据isEditable变为true,并复制一个原来的title（oldTitle），准备在取消的时候备用
  const updateInput=(treeItem:treeObj)=>{
    treeItem.oldTitle = treeItem.title
    treeItem.isEditable = true
    cloneAndChangeToNodeTitle(treeData)
  }
  //点击保存，关闭可编辑
  const saveInput=(treeItem:treeObj)=>{
    treeItem.isEditable = false
    cloneAndChangeToNodeTitle(treeData)
  }
  //点击取消，将title还原为oldTitle
  const cancelInput=(treeItem:treeObj)=>{
    treeItem.isEditable = false
    treeItem.title = treeItem.oldTitle||''
    cloneAndChangeToNodeTitle(treeData)
  }
  //将title从str转为Node
  const changeTitleStrToNode=(data:treeModel[],treeData:treeModel[])=>{
    for(let i=0;i<data.length;i++){
      let item:treeObj = data[i];
      let treeItem:any = treeData[i]    //该数据拿去修改原值，并更新
      // let unchangedItem = treeData[i]         //该数据用来在取消时拿到原有没有被改变的值
      item.title = (
        <div>
          <div className={item.isEditable?"none":"inline"}>
            <div className="inline mr-1">{item.title}</div>
            <button onClick={()=>updateInput(treeItem)}>修改</button>
          </div>
          <div className={item.isEditable?"inline":"none"}>
            <input className="mr-1" value={item.title} onChange={(e) => changeTitle(e, treeItem)} onKeyDown={(e)=>e.keyCode===13&&saveInput(treeItem)}/>
            <button className="mr-1" onClick={()=>saveInput(treeItem)}>确定</button>
            <button onClick={()=>cancelInput(treeItem)}>取消</button>
          </div>
        </div>
      )
      if(item.children){
        changeTitleStrToNode(item.children,treeItem.children)
      }
    }
    return data
  }
  //改变title
  const changeTitle=(e:React.ChangeEvent<HTMLInputElement>,treeItem:treeObj)=>{
    let value:string = e.target.value
    treeItem.title = value
    cloneAndChangeToNodeTitle(treeData)
  }
  return (
    <div>
      <Tree
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeNodeData}
    />
    </div>
  );
}
