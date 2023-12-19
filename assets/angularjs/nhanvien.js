window.NhanVienController = function ($scope, $http, $location, $routeParams) {
    let url = "http://localhost:8080/api/employee";
    $scope.loadAll = function () {
      $scope.list = [];
      $http.get(url).then(function (response) {
        $scope.list = response.data;
      });
    };
    $scope.listVaitro = [];
    $http.get("http://localhost:8080/api/role").then(function (response) {
      $scope.listVaitro = response.data;
    });
    $scope.loadAll();
    //load category ngừng hoạt động
    $http
      .get("http://localhost:8080/api/employee/stopworking")
      .then(function (response) {
        $scope.employeeStops = response.data;
      });
    //restore category
    $scope.restore = function (id) {
      Swal.fire({
        title: "Bạn có chắc muốn khôi phục ?",
        showCancelButton: true,
        confirmButtonText: "Khôi Phục",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          $http
            .put("http://localhost:8080/api/employee/restore/" + id)
            .then(function (response) {
              if (response.status === 200) {
                Swal.fire("Khôi Phúc Thành Công !", "", "success");
                $scope.loadAll(); 
                $http
                  .get("http://localhost:8080/api/employee/stopworking")
                  .then(function (response) {
                    $scope.employeeStops = response.data;
                  });
              } else {
                Swal.fire("Khôi Phục thất bại !", "", "error");
              }
            });
        }
      });
    };
    $scope.pager = {
      page: 0,
      size: 5,
      get items() {
        var start = this.page * this.size;
        return $scope.list.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.list.length) / this.size);
      },
  
      first() {
        this.page = 0;
      },
      prev() {
        this.page--;
        if (this.page < 0) {
          this.last();
        }
      },
      next() {
        this.page++;
        if (this.page >= this.count) {
          this.first();
        }
      },
      last() {
        this.page = this.count - 1;
      },
    };
    $scope.pagerStop = {
      page: 0,
      size: 5,
      get items() {
        var start = this.page * this.size;
        return $scope.employeeStops.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.employeeStops.length) / this.size);
      },
  
      first() {
        this.page = 0;
      },
      prev() {
        this.page--;
        if (this.page < 0) {
          this.last();
        }
      },
      next() {
        this.page++;
        if (this.page >= this.count) {
          this.first();
        }
      },
      last() {
        this.page = this.count - 1;
      },
    };
    $scope.form = {
      code: "",
      fullname: "",
      username: "",
      password: "",
      image: "",
      gender: "",
      phone: "",
      status: "",
      email: "",
    };
    //add
    $scope.add = function () {
      var gender = true;
      if (document.getElementById("gtNu").checked == true) {
        gender = false;
      }
      var idRole = document.getElementById("vaitro").value;
      var MainImage = document.getElementById("fileUpload").files;
      if (MainImage.length == 0) {
        // Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
        // return;
      }
      var img = new FormData();
      img.append("files", MainImage[0]);
      $http
        .post("http://localhost:8080/api/upload", img, {
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined,
          },
        })
        .then(function (upImage) {
          $http
            .post(url, {
              code: $scope.form.code,
              fullname: $scope.form.fullname,
              username: $scope.form.username,
              password: $scope.form.password,
              image: upImage.data[0],
              gender: gender,
              phone: $scope.form.phone,
              email: $scope.form.email,
              idRole: idRole,
            })
            .then(function (resp) {
              if (resp.status === 200) {
                Swal.fire("Thêm thành công !", "", "success");
                setTimeout(() => {
                  location.href = "#/employee/view";
                }, 2000);
              }
            })
            .catch(function (err) {
              if (err.status === 400) {
                console.log(err.data);
                $scope.validationErrors = err.data;
              }
            });
        });
    };
    //update
    $scope.update = function () {
      var gender = true;
      if (document.getElementById("gtNu").checked == true) {
        gender = false;
      }
      var idRole = document.getElementById("vaitro").value;
  
      var status = document.getElementById("trangthai").value;
  
      var MainImage = document.getElementById("fileUpload").files;
      if (MainImage.length == 0) {
        // Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
        // return;
      }
      if (MainImage.length > 0) {
        var img = new FormData();
        img.append("files", MainImage[0]);
        $http
          .post("http://localhost:8080/api/upload", img, {
            transformRequest: angular.identity,
            headers: {
              "Content-Type": undefined,
            },
          })
          .then(function (upImage) {
            let id = $routeParams.id;
            $http
              .put("http://localhost:8080/api/employee/update/" + id, {
                code: $scope.form.code,
                fullname: $scope.form.fullname,
                username: $scope.form.username,
                password: $scope.form.password,
                image: upImage.data[0],
                gender: gender,
                phone: $scope.form.phone,
                email: $scope.form.email,
                status: status,
                idRole: idRole,
              })
              .then(function (resp) {
                if (resp.status === 200) {
                  Swal.fire("Sửa thành công !", "", "success");
                  setTimeout(() => {
                    location.href = "#/employee/view";
                  }, 2000);
                }
              })
              .catch(function (err) {
                if (err.status === 400) {
                  $scope.validationErrors = err.data;
                }
              });
          });
      } else {
        let id = $routeParams.id;
        $http
          .get("http://localhost:8080/api/employee/" + id)
          .then(function (resp) {
            $http
              .put("http://localhost:8080/api/employee/update/" + id, {
                code: $scope.form.code,
                fullname: $scope.form.fullname,
                username: $scope.form.username,
                password: $scope.form.password,
                image: resp.data.image,
                gender: $scope.form.gender,
                phone: $scope.form.phone,
                email: $scope.form.email,
                status: status,
                idRole: idRole,
              })
              .then(function (resp) {
                if (resp.status === 200) {
                  Swal.fire("Sửa thành công !", "", "success");
                  setTimeout(() => {
                    location.href = "#/employee/view";
                  }, 2000);
                }
              })
              .catch(function (err) {
                if (err.status === 400) {
                  $scope.validationErrors = err.data;
                }
              });
          });
      }
    };
  
    //delete fake
    $scope.delete = function (id) {
      Swal.fire({
        title: "Bạn có chắc muốn xóa ?",
        showCancelButton: true,
        confirmButtonText: "Xóa",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          $http
            .delete("http://localhost:8080/api/employee/delete/" + id)
            .then(function (response) {
              if (response.status === 200) {
                Swal.fire("Xóa thành công !", "", "success");
                $scope.loadAll();
                $http
                  .get("http://localhost:8080/api/employee/stopworking")
                  .then(function (response) {
                    $scope.employeeStops = response.data;
                  });
              } else {
                // Xử lý khi có lỗi từ server nhưng không phải lỗi 200
                Swal.fire("Xóa thất bại !", "", "error");
              }
            })
            .catch(function (err) {
              // Xử lý lỗi khi gọi API delete
              $http
                .put("http://localhost:8080/api/employee/deletefake/" + id)
                .then(function (response) {
                  Swal.fire(
                    "Không thể xóa! Đã chuyển sang ngừng hoạt động",
                    "",
                    "error"
                  );
                  $scope.loadAll();
                  $http
                    .get("http://localhost:8080/api/employee/stopworking")
                    .then(function (response) {
                      $scope.employeeStops = response.data;
                    });
                })
                .catch(function (error) {
                  // Xử lý lỗi khi gọi API put
                  Swal.fire("Lỗi khi xóa! Thử lại sau", "", "error");
                  console.error("Error:", error);
                });
            });
        }
      });
    };
    // delete
    // $scope.delete = function (id) {
    //     Swal.fire({
    //         title: 'Bạn có chắc muốn xóa ?',
    //         showCancelButton: true,
    //         confirmButtonText: 'Xóa',
    //     }).then((result) => {
    //         /* Read more about isConfirmed, isDenied below */
    //         if (result.isConfirmed) {
    //             $http.put("http://localhost:8080/api/employee/delete/" + id).then(function (response) {
    //                 if (response.status === 200) {
    //                     Swal.fire('Xóa thành công !', '', 'success')
    //                     $scope.loadAll();
    //                 }
    //                 else {
    //                     Swal.fire('Xóa thất bại !', '', 'error')
    //                 }
    //             })
  
    //         }
    //     })
    // }
  
    // detail
    $scope.detail = function () {
      let id = $routeParams.id;
      $http.get("http://localhost:8080/api/employee/" + id).then(function (resp) {
        $scope.form = resp.data;
        if (resp.data.role.id == 1) {
          document.getElementById("qly").selected = true;
        } else {
          document.getElementById("nv").selected = true;
        }
  
        $scope.form = resp.data;
        if (resp.data.gender == true) {
          document.getElementById("gtNam").checked = true;
        } else {
          document.getElementById("gtNu").checked = true;
        }
  
        $scope.form = resp.data;
        if (resp.data.status == 0) {
          document.getElementById("lam").selected = true;
        } else {
          document.getElementById("nghi").selected = true;
        }
      });
    };
  
    // search by name
    $scope.search = function () {
      var name = document.getElementById("name").value;
      if (name.trim().length === 0) {
        Swal.fire("Nhập tên trước khi tìm kiếm...", "", "error");
      } else {
        $http
          .get("http://localhost:8080/api/employee/search/" + name)
          .then(function (search) {
            $scope.list = search.data;
            $scope.pager.first();
          });
      }
    };
    $scope.filter = function () {
      let idRole = document.getElementById("vaitro").value;
      let idrole = idRole != "" ? idRole : null;
      var params = {
        idrole: idrole,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/employee/filter",
        params: params,
      }).then(function (resp) {
        $scope.list = resp.data;
        $scope.pager.first();
        // Swal.fire("Lọc thành công !","","success");
      });
    };
  };
  