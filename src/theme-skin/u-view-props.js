// 设置u-view组件库 组件主题色 或者其他默认属性
export default ({ primaryColor } = {}) => {

  const colorProps = {
    color: primaryColor,
  };
  const activeColorProps = {
    activeColor: primaryColor,
  };
  
  // 返回对象为 uni.$u.setConfig({props}) 的 props
  return {
    datetimePicker: {
      confirmColor: primaryColor,
    },
    calendar: colorProps,
    checkboxGroup: activeColorProps,
    radioGroup: activeColorProps,
    switch: activeColorProps,
    picker: {
      confirmColor: primaryColor
    },
    modal: {
      confirmColor: primaryColor
    },
    scrollList: {
      indicatorActiveColor: primaryColor
    }
  };

};
