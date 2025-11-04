/**将数组转换为符合页面的树形结构 */
export default function roomTree(data = []) {
  data = data.filter((item) => item.houseAddrInfoId && item.houseBuilding && item.houseCell && item.houseFloor && item.houseRoom)
  data = sortBuild(data)

  return setBuildList(data)
}

/**需要根据 楼栋、单元、楼层、房间 进行排序 */
function sortBuild(data = []) {
  const res = data.sort((pre, next) => {
    if (pre.houseBuilding != next.houseBuilding) return getCharCode(pre.houseBuilding) - getCharCode(next.houseBuilding)
    else if (pre.houseCell != next.houseCell) return getCharCode(pre.houseCell) - getCharCode(next.houseCell)
    else if (pre.houseFloor != next.houseFloor) return getCharCode(pre.houseFloor) - getCharCode(next.houseFloor)
    else if (pre.houseRoom != next.houseRoom) return getCharCode(pre.houseRoom) - getCharCode(next.houseRoom)
    else return 0
  })
  return res
}

function getCharCode(str) {
  if (typeof(str) == 'number') return str
  if (!str) return 0
  if (typeof(str) == 'string') {
    // 先尝试转换为数字
    const _numTmp = parseInt(str)
    if (!isNaN(_numTmp)) return _numTmp

    let res = 0
    for (let i = 0, l = str.length; i < l; i++) {
      res += str.charCodeAt(i)
    }
    return res
  }
  return 0
}

/**楼栋分组 */
function setBuildList(data) {
  let map = []
  data.forEach((item) => {
    const id = getNodeId([item.houseBuilding])
    const index = map.findIndex((tmp) => tmp.name == id)
    
    let child = {}
    if (index == -1) {
      child = { label: item.houseBuilding, name: id, children: [] }
      map.push(child)
    } else {
      child = map[index]
    }
    
    child.children.push(item)
  })

  map.forEach((item) => {
    item.children = setUnitList(item.children)
  })
  return map
}

/**单元分组 */
function setUnitList(data) {
  let map = []
  data.forEach((item) => {
    const id = getNodeId([item.houseBuilding, item.houseCell])
    const index = map.findIndex((tmp) => tmp.name == id)

    let child = {}
    if (index == -1) {
      child = { label: item.houseCell, name: id, children: [] }
      map.push(child)
    } else {
      child = map[index]
    }

    child.children.push(item)
  })

  map.forEach((item) => {
    item.children = setFloorList(item.children)
  })
  return map
}

/**楼层分组 */
function setFloorList(data) {
  let map = []
  data.forEach((item) => {
    const id = getNodeId([item.houseBuilding, item.houseCell, item.houseFloor])
    const index = map.findIndex((tmp) => tmp.name == id)

    let child = {}
    if (index == -1) {
      child = { label: item.houseFloor, name: id, children: [] }
      map.push(child)
    } else {
      child = map[index]
    }

    child.children.push(item)
  })

  map.forEach((item) => {
    item.children = setRoomList(item.children)
  })
  return map
}

/**房间分组 */
function setRoomList(data) {
  let map = []
  data.forEach((item) => {
    const id = getNodeId([item.houseBuilding, item.houseCell, item.houseFloor, item.houseRoom])
    const index = map.findIndex((tmp) => tmp.name == id)

    if (index == -1) {
      map.push({ label: item.houseRoom, name: id, data: item })
    }
  })

  return map
}

function getNodeId(args = []) {
  return args.join('-')
}
