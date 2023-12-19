
window.KichThuocController = function ($scope, $http, $location, $routeParams) {
  let url = "http://localhost:8080/api/size";
  $scope.loadAll = function () {
    // load size
    $scope.list = [];
    $http.get(url).then(function (response) {
      $scope.list = response.data;
    })
    console.log($scope.list)
  }

  $scope.loadStop = function () {
    // load size
    $scope.list = [];
    $http.get("http://localhost:8080/api/size/stopworking").then(function (response) {
      $scope.listStop = response.data;
      console.log($scope.listStop)
    })
  }
  $scope.loadStop();
  $scope.loadAll();
  $scope.form = {
    name: '',
    description: '',
  }

  // load size ngừng hoạt động


  //update size
  $scope.update = function () {
    let id = $routeParams.id;
    $http.put("http://localhost:8080/api/size/update/" + id, {
      name: $scope.form.name,
      description: $scope.form.description
    }).then(function (resp) {
      if (resp.status === 200) {
        Swal.fire('Sửa thành công !', '', 'success')
        setTimeout(() => {
          location.href = "#/sizes/view";
        }, 2000);
      }
    }).catch(function (err) {
      if (err.status === 400) {
        $scope.validationErrors = err.data;
      }

    })
  }

  // Khôi phục
  $scope.restore = function (id) {
    Swal.fire({
      title: 'Bạn có chắc muốn khôi phục ?',
      showCancelButton: true,
      confirmButtonText: 'Khôi Phục',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http.put("http://localhost:8080/api/size/restore/" + id).then(function (response) {
          if (response.status === 200) {
            Swal.fire('Khôi Phúc Thành Công !', '', 'success')
            $scope.loadAll();
            $http.get("http://localhost:8080/api/size/stopworking").then(function (response) {
              $scope.listStop = response.data;
            })
          }
          else {
            Swal.fire('Khôi Phục thất bại !', '', 'error')
          }
        })

      }
    })
  }
  //delete category
  $scope.delete = function (id) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa ?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http.delete("http://localhost:8080/api/size/delete/" + id)
          .then(function (response) {
            if (response.status === 200) {
              Swal.fire('Xóa thành công !', '', 'success')
              $scope.loadAll();
              $http.get("http://localhost:8080/api/size/stopworking").then(function (response) {
                $scope.list = response.data;
              })
            } else {
              // Xử lý khi có lỗi từ server nhưng không phải lỗi 200
              Swal.fire('Xóa thất bại !', '', 'error');
            }
          })
          .catch(function (err) {
            // Xử lý lỗi khi gọi API delete
            $http.put("http://localhost:8080/api/size/deletefake/" + id)
              .then(function (response) {
                Swal.fire(' Đã chuyển ngừng hoạt động', '', 'error')
                $scope.loadAll();
                $http.get("http://localhost:8080/api/size/stopworking").then(function (response) {
                  $scope.listStop = response.data;
                })
              })
              .catch(function (error) {
                // Xử lý lỗi khi gọi API put
                Swal.fire('Lỗi khi xóa danh mục! Thử lại sau', '', 'error');
                console.error('Error:', error);
              });
          });
      }
    });
  }



  //detail 

  $scope.detail = function () {
    let id = $routeParams.id;
    $http.get("http://localhost:8080/api/size/" + id).then(function (resp) {
      $scope.form = resp.data;
    })
  }

  // pagation
  $scope.pager = {
    page: 0,
    size: 5,
    get items() {
      var start = this.page * this.size;
      return $scope.list.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil(1.0 * $scope.list.length / this.size);
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
    }
  }
  ///page stop
  $scope.pagerStop = {
    page: 0,
    size: 5,
    get items() {
      var start = this.page * this.size;
      return $scope.listStop.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil(1.0 * $scope.listStop.length / this.size);
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
    }
  }
  // add size
  $scope.add = function () {
    $http
      .post(url, {
        name: $scope.form.name,
        description: $scope.form.description,
      })
      .then(function (resp) {
        if (resp.status === 200) {
          Swal.fire("Thêm thành công !", "", "success");
          setTimeout(() => {
            location.href = "#/sizes/view";
          }, 2000);
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
        }
      });
  };


  // update size
  $scope.update = function () {
    let id = $routeParams.id;
    $http
      .put("http://localhost:8080/api/size/update/" + id, {
        name: $scope.form.name,
        description: $scope.form.description,
      })
      .then(function (resp) {
        if (resp.status === 200) {
          Swal.fire("Sửa thành công !", "", "success");
          setTimeout(() => {
            location.href = "#/sizes/view";
          }, 2000);
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
        }
      });
  };

  // detail
  $scope.detail = function () {
    let id = $routeParams.id;
    $http.get("http://localhost:8080/api/size/" + id).then(function (resp) {
      $scope.form = resp.data;
    });
  };


  // export Excel
  $scope.exportToExcel = function () {
    Swal.fire({
      title: "Bạn có chắc muốn xuất Exel ?",
      showCancelButton: true,
      confirmButtonText: "Xuất",
    }).then((result) => {
      if (result.isConfirmed) {
        var dataArray = $scope.list.map(function (item) {
          return {
            Id: item.id,
            Name: item.name,
            Description: item.description,
            CreateDate: item.createDate,
            UpdateDate: item.updateDate,
          };
        });

        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.json_to_sheet(dataArray);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sheet");
        XLSX.writeFile(workbook, "data" + new Date() + ".xlsx");
        Swal.fire("Xuất file exel thành công !", "", "success");
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
        .get("http://localhost:8080/api/size/search/" + name)
        .then(function (search) {
          $scope.list = search.data;
          $scope.pager.first();
        });
    }
  };

  // import Excel
  $scope.importExel = function () {
    let file = document.getElementById("fileInput").files;

    if (file.length === 0) {
      Swal.fire("Vui lòng tải lên file Exel trước khi thêm !", "", "error");
    } else {
      let form = new FormData();
      form.append("file", file[0]);
      $http
        .post("/api/product/importExel", form, {
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined,
          },
        })
        .catch(function (err) {
          if (err.status === 500) {
            Swal.fire("Có lỗi xảy ra vui lòng xem lại !", "", "error");
          }
        })
        .then(function (ok) {
          Swal.fire("Thêm data từ Exel thành công !", "", "success");
          setTimeout(() => {
            location.href = "/admin/products/view";
          }, 2000);
        });
    }
  };
}
