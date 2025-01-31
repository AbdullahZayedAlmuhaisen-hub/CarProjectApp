$('.date-own').datepicker({
    minViewMode: 2,
    format: 'yyyy'
});
async function getMakeType(id) {

   await axios.get(`/api/Vehicle/getVehicleTypes/${id}`)
        .then(response => {
            const vehicleTypes = response.data;
            const typesHtml = vehicleTypes.map(type => type.VehicleTypeName).join(', ');
            $('#typeInput').val(typesHtml);
            $('#exampleModalLong').modal('show'); 
        })
        .catch(error => {
            console.error('Failed to fetch Vehicle types:', error);
            alert('Failed to fetch Vehicle types.');
        });
}
$(document).ready(function () {
    const carMakeSelect = $('#carMakeSelect');

    const jsonUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json';
    const rowsPerPage = 15;
    let currentPage = 1;
    let data = [];


    $.ajax({
        url: jsonUrl,
        method: 'GET',
        success: function (responseData) {
            data = responseData.Results;
            if (Array.isArray(data) && data.length > 0) {
                renderTable();
                let makes = data;

                carMakeSelect.empty();
                carMakeSelect.append('<option value="" selected disabled>Select a car make</option>');

                $.each(makes, function (index, make) {
                    carMakeSelect.append($('<option>', {
                        value: make.Make_ID,
                        text: make.Make_Name
                    }));
                });
            } else {
                $('#tableBody').html('<tr><td colspan="2">No data available</td></tr>');
            }
        },
        error: function () {
            console.error('Error fetching data');
            $('#tableBody').html('<tr><td colspan="2">Error loading data</td></tr>');
        }
    });

    function renderTable() {
        $('#tableBody').empty();
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = data.slice(start, end);

        pageData.forEach(item => {
            let row = `<tr>
                             <td>${item.Make_ID}</td>
                             <td>${item.Make_Name}</td>
                             <td style="    text-align: -webkit-center;">
                              <button style='background-color: transparent;border: none;' type="button" class="btn btn-primary" data-toggle="modal" onclick="getMakeType(${item.Make_ID})">
                                     <i style="color:black"class="fa-solid fa-eye"></i>
                               </button>
                             </td>
                         </tr>`;
            $('#tableBody').append(row);
        });

        $('#pageNumber').text(`Page ${currentPage}`);
        updatePaginationButtons();
    }


    function updatePaginationButtons() {
        $('#prevBtn').prop('disabled', currentPage === 1);
        $('#nextBtn').prop('disabled', currentPage * rowsPerPage >= data.length);
    }


    $('#prevBtn').click(function () {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });


    $('#nextBtn').click(function () {
        if (currentPage * rowsPerPage < data.length) {
            currentPage++;
            renderTable();
        }
    });
});
$('#ClearButton').on('click', function () {

    $('#allMakesTable').show();
    $('#allMakesTableTitle').show();
    $('#allMakesTableFooter').show();
    $('#SearchTable').hide();
    $('#SearchTableTitle').hide();
    $('#SearchTableFooter').hide();
});

$('#searchButton').on('click', function () {
    const makeId = $('#carMakeSelect').val();
    const year = $('#year').val();
    if (makeId !== "" && year !== "") {
        const jsonUrl = `/api/Vehicle/getModels/${makeId}/${year}`;
        const rowsPerPage = 15;
        let currentPage = 1;
        let data = [];


        $.ajax({
            url: jsonUrl,
            method: 'GET',
            success: function (responseData) {
                data = responseData;
                if (Array.isArray(data) && data.length > 0) {
                    $('#allMakesTable').hide();
                    $('#allMakesTableTitle').hide();
                    $('#allMakesTableFooter').hide();
                    renderTable2();
                } else {
                    Swal.fire('Sorry!', 'There is No Car Model With These Crateria', 'warning');
                }
            },
            error: function () {
                console.error('Error fetching data');
                $('#tableBody2').html('<tr><td colspan="2">Error loading data</td></tr>');
            }
        });

        function renderTable2() {
            $('#SearchTable').show();
            $('#SearchTableFooter').show();
            $('#SearchTableTitle').show();
            $('#tableBody2').empty();
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = data.slice(start, end);

            pageData.forEach(item => {
                let row = `<tr>
                             <td>${item.Make_ID}</td>
                             <td>${item.Make_Name}</td>
                                     <td>${item.Model_ID}</td>
                                         <td>${item.Model_Name}</td>
                         </tr>`;
                $('#tableBody2').append(row);
            });

            $('#pageNumber').text(`Page ${currentPage}`);
            updatePaginationButtons();
        }


        function updatePaginationButtons() {
            $('#prevBtn2').prop('disabled', currentPage === 1);
            $('#nextBtn2').prop('disabled', currentPage * rowsPerPage >= data.length);
        }


        $('#prevBtn2').click(function () {
            if (currentPage > 1) {
                currentPage--;
                renderTable2();
            }
        });


        $('#nextBtn2').click(function () {
            if (currentPage * rowsPerPage < data.length) {
                currentPage++;
                renderTable2();
            }
        });
    } else {
        Swal.fire('Please!', 'select Car and Manufacture Year', 'error');
    }
});

