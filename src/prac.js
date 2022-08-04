
/*
객체지향 프로그래밍
프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절차지향적 관점에서 벗어나
여러 개의 독립적 단위, 즉 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

객체지향 프로그래밍은 실세계의 실체(사물이나 개념)를 인식하는 철학적 사고를 프로그래밍에 접목하려는 시도에서 시작.
실체는 특징이나 성질을 나타내는 속성을 가지고 있고, 이를 통해 실체를 인식하거나 구별할 수 있다.
ex) 이름,나이,성별과 같이 속성을 구체적으로 표현하면 특정한 사람을 다른 사람들과 구별하여 인식할 수 있다.

다양한 속성 중에서 프로그램에 필요한 속성만 간추려 내어 표현하는 것을 추상화라 한다.

속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체라고 한다.
객체지향 프로그래밍은 독립적인 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임이다.

객체지향 프로그래밍은 객체의 상태를 나타내는 데이터와 상태를 조작할 수 있는 동작을 하나의 논리적인 단위로 묶어서
생각한다. 객체는 상태 데이터와 동작을 하나의 논리적인 단위로 묶은 복합적인 자료구조
프로퍼티, 메서드

상속
객체지향 프로그래밍의 핵심개념
어떤 객체의 프로퍼티나 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.
코드의 재사용으로 불필요한 중복을 제거할 수 있다

생성자 함수롤 사용하여 객체를 생성할 시 만약 모든 객체가 같은 동작을 수행한다고 하면
불필요한 메서드를 중복으로 생성하게 되는 셈이다
동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비한다
인스턴스를 생성할 때마다 메서드를 생성하기 떄문에 퍼포먼스에도 악영향을 준다.

자바스크립트 프로토타입을 기반으로 상속을 구현하면 된다


*/

// const Person = (function () {
//     let myName = "Lee"

//     // 생성자 함수
//     function Person(name) {
//         this.name =  name;
//     }

//     // 프로토타입 매서드
//     Person.prototype.sayHello = function () {
//         console.log(`Hi my name is ${this.name}, and your name is ${myName}!!`);
//     }

//     // 생성자 함수 반환
//     return Person;
// }());

// const me = new Person('Lee');
// const you = new Person('Kang');
// me.sayHello();
// you.sayHello();

// me.sayHello = function () {
//     console.log(`Hi my name is ${this.name}`);
// }
// me.sayHello();

// delete Person.prototype.sayHello;
// me.sayHello();
// you.sayHello();

// function Person(name) {
//     this.name = name;
// }

// const me = new Person("Lee");

// const parent = {
//     constructor : Person,
//     sayHello() {
//         console.log(`Hi! My name is ${this.name}`);
//     }
// };

// // Person.prototype = parent;
// // me 객체의 프로토타입을 parent 객체로 교체한다.
// Object.setPrototypeOf(me, parent);

// me.sayHello();

// console.log(me.__proto__);
// console.log(parent.constructor);
// console.log(me.constructor === Person);
// console.log(me.constructor === Object);

// const person = {
//     firstName : "In",
//     lastName : "Lee",

//     get fullName() {
//         return `${this.firstName} ${this.lastName}`
//     },
//     set fullName(name) {
//         [this.firstName, this.lastName] = name.split(' ');
//     }
// };

// console.log(person.fullName);
// person.fullName = "Wan Lee";
// console.log(person.fullName);

// function Type () {}

// var types = [
//   new Array(),
//   [],
//   new Boolean(),
//   true,             // 바뀌지 않음
//   new Date(),
//   new Error(),
//   new Function(),
//   function () {},
//   Math,
//   new Number(),
//   1,                // 바뀌지 않음
//   new Object(),
//   {},
//   new RegExp(),
//   /(?:)/,
//   new String(),
//   'test'            // 바뀌지 않음
// ];

// for (var i = 0; i < types.length; i++) {
//   types[i].constructor = Type;
//   types[i] = [`1 : ${types[i].constructor}`, `2 : ${types[i] instanceof Type}`, `3 : ${types[i].toString()}`];
// }

// console.log(types.join('\n'));

// const Human = function (name) {
//     this.name = name;
//     this.age = 0;
// }

// Human.prototype.getAge = function() {
//     return this.age;
// }
// Human.prototype.getOlder = function() {
//     return this.age += 1;
// }
// Human.prototype.introduceMySelf = function() {
//     return `Hello my name is ${this.name}, and i'm ${this.age} year old.${'\n'}Nice to meet u!`;
// }

// const person = new Human('Lee In');

// console.log(person.getAge());
// console.log(person.getOlder());
// console.log(person.getAge());
// console.log(person.introduceMySelf());

// const num = 1.5;
// console.log(num.toFixed()); // 2
// const numObj = new Number(1.5);
// console.log(typeof num, typeof numObj); // number object
// console.log(Object.getPrototypeOf(num) === Object.getPrototypeOf(numObj)); // true
// console.log(num === numObj); // false


// console.log(3/0); // infinity
// console.log(typeof Infinity); // number

// // 숫자가 아님을 나태내는 숫자값 NaN
// console.log(globalThis.NaN); // NaN
// console.log(3/0); // number
// console.log(typeof NaN);// number

// console.log(globalThis.undefined); // undefined
// console.log(typeof undefined); // undefined

function foo () {
    // 선언되지 않은 식별자에 값을 할당
    y = 10           // global.y = 20;
    console.log(y);
}
foo();           // 10
console.log(y);  // 10
delete y;
console.log(y);  // ReferenceError: y is not defined