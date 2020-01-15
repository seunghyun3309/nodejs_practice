var members=['egoing', 'sghn33', 'hojo']; //배열= 데이터를 순서대로 넣으면 됨
console.log(members[1]); //sghn33

var i=0;
while(i<members.length)
{
  console.log(members[i]);
  i+=1;
}

var roles={
  'manager':'egoing',
  'pitcher':'sghn33',
  'batter':'hojo'
}
// 데이터 별로 이름을 배정
console.log(roles.pitcher); //sghn33
for(var name in roles)
//name이라고 하는 변수에는 key가 들어오도록 약속
//roles는 value name은 key
{
  console.log('object=> '+ name,' value=> '+roles[name]);
}
