export const getFieldInfo = function(params) {
  console.log('调用接口getFieldInfo');
  console.log('参数', params);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('123');
    }, 2000);
  });
};

export const dictionary = function(params) {
  console.log('调用接口dictionary');
  console.log('字典类型', params.type);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: [
          {
            code: '1',
            name: '字典1'
          },
          {
            code: '2',
            name: '字典2'
          }
        ]
      });
    }, 2000);
  });
};
