// Variables
const cart = document.getElementById('carrito');
const courseList = document.getElementById('lista-cursos');
const cartList = document.querySelector('#lista-carrito tbody');
const emptyCartBtn = document.getElementById('vaciar-carrito');

// Event Listenners
document.addEventListener('DOMContentLoaded', loadLocalStorage);
courseList.addEventListener('click', addCourse);
cart.addEventListener('click', removeCourse);
emptyCartBtn.addEventListener('click', emptyCart);

// Functions
function addCourse(e) {
  e.preventDefault();
  // Delegation to add the course
  if (e.target.classList.contains('agregar-carrito')) {
    const course = e.target.parentElement.parentElement;
    readCourseData(course);
  }
}

function readCourseData(course) {
  const courseData = {
    image: course.querySelector('img').src,
    title: course.querySelector('h4').innerText,
    price: course.querySelector('span').innerText,
    id: course.querySelector('a').getAttribute('data-id')
  };
  addCourseCart(courseData);
}

function addCourseCart(course) {
  const row = createCourseTemplate(course.image, course.title, course.price, course.id);
  cartList.appendChild(row);
  addCourseLocalStorage(course);
}

function createCourseTemplate(image, title, price, id) {
  const course = document.createElement('tr');
  course.innerHTML = `
    <td>
      <img src="${image}" width=100>
    </td>
    <td>${title}</td>
    <td>${price}</td>
    <td>
      <a href="#" class="borrar-curso" data-id="${id}">X</a>
    </td>
  `;

  return course;
}

function removeCourse(e) {
  if (e.target.className === 'borrar-curso') {
    e.target.parentElement.parentElement.remove();
    const courseID = e.target.parentElement.parentElement.querySelector('a').getAttribute('data-id');
    removeCourseLocalStorage(courseID);
  }
}

function removeCourseLocalStorage(courseID) {
  const courses = getCoursesLocalStorage();
  courses.forEach((course, index) => {
    if (courseID === course.id) {
      courses.splice(index, 1);
    }
  });
  localStorage.setItem('courses', JSON.stringify(courses));
}

function emptyCart() {
  // Slow way to clean the car
  cartList.innerHTML = '';

  // Better way to clean the car
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }

  localStorage.clear();
}

function addCourseLocalStorage(course) {
  const courses = getCoursesLocalStorage();
  courses.push(course);
  localStorage.setItem('courses', JSON.stringify(courses));
}

function getCoursesLocalStorage() {
  let courses = localStorage.getItem('courses');
  if (courses) {
    courses = JSON.parse(courses);
  } else {
    courses = [];
  }

  return courses;
}

function loadLocalStorage() {
  const courses = getCoursesLocalStorage();
  courses.forEach(courseV => {
    const course = createCourseTemplate(courseV.image, courseV.title, courseV.price, courseV.id);
    cartList.appendChild(course);
  });
}
