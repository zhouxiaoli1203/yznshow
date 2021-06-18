<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less" >
.form-err {
  position: absolute;
  top: -32px;
  color: #FFB316;
  width: auto;
  right: 0;
}
.form-err-group  {
  width: auto;
  position: relative;
  &.fit {
    width: fit-content;
  }
}
.form-err-group .ant-input {
  border: 1px solid #FFB316 !important;
}
.form-err-group .ant-input:focus {
  box-shadow: 0 0 0 2px rgba(255, 179, 22, 0.2);
}
html {
  font-size: 18.75px; 
}
.link {
  color: #fff;
}
.next-btn {
  width: 125px;
  height: 40px;
  &:first-child {
    margin-right: 24px;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
-webkit-appearance: none;
}
.createFollowCheck input[type="number"] {
-moz-appearance: textfield;
}
.ant-message {
  top: 35%;
}
.ant-modal {
  top: 20%;
}
textarea.ant-input {
  padding-bottom: 25px;
}
.ant-form-item-label > label::after {
  content: ''
}
</style>