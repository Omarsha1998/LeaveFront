<template>
  <div class="pdf-generator">
    <div class="bg-positive text-white" style="width: 100%;">
      <q-btn @click="generatePDFForEntry" label="Print PDF" color="primary" style="line-height: 50%; width: 100%;">
        <q-icon class="pdf-icon q-ml-xs" name="picture_as_pdf" size="20px"/>
      </q-btn>
    </div>
  </div>
</template>


<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logoPath from '../assets/logouerm.jpg';


export default {

  data() {
    return {
      LeaveTypes: [
        { label: 'Vacation Leave', value: 'VL' },
        { label: 'Sick Leave', value: 'SL' },
        { label: 'Emergency Leave', value: 'EL' },
        { label: 'Birthday Leave', value: 'BL' },
        { label: 'Leave Without Pay', value: 'LWOP' },
        { label: 'Magna Carta', value: 'MGL' },
        { label: 'Maternity Leave', value: 'ML' },
        { label: 'Official Leave', value: 'OL' },
        { label: 'Parental Leave', value: 'PRL' },
        { label: 'Paternity Leave', value: 'PL' },
        { label: 'Sabbatical Leave', value: 'SBL' },
        { label: 'Study Leave', value: 'STL' },
        { label: 'Union Leave', value: 'UL' },
      ],
    }
  },

  props: {
    entry: {
      type: Object,
      required: true,
    },
  },

  computed: {

    base64Image() {
      return this.$store.getters['leaveModule/base64Image'];
    },

    LeaveTypeLabels() {
      return this.LeaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },


  methods: {

    formatDateTime(dateTimeString) {
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    loadAndConvertToBase64() {
      this.$store.dispatch('leaveModule/loadAndConvertToBase64', logoPath);
    },

    generatePDFForEntry() {

      const { entry } = this;

      if (!entry || !entry.Code || !entry.LastName || !entry.FirstName 
          || !entry.MiddleInitial || !entry.LeaveID || !entry.Days 
          || !entry.TimeFrom || !entry.DateFrom || !entry.DateTo || !entry.LeaveType) {
          console.error("Invalid entry data.");
          return;
      };

      const currentDate = new Date().toLocaleDateString();
      const leaveDetails = [];
      const leaveDetails2 = [];
      const signDetails = [];
      const signDetails2 = [];
      const processedPositions = [];

      const userCode = entry.Code;

      const userBalanceDetails = this.$store.state.leaveModule.AllBalanceDetails.filter(user => user.EmployeeCode == userCode);

      const leaveTypeOrder = { VL: 1, SL: 2, EL: 3 };
      userBalanceDetails.sort((a, b) => leaveTypeOrder[a.leaveType] - leaveTypeOrder[b.leaveType]);

      let position = '';
      let department = '';
      let employeeStatus = '';

      userBalanceDetails.forEach(userEntry => {
          position = userEntry.Position;
          department = userEntry.Department;
          employeeStatus = userEntry.EmployeeStatus;

          const leaveTypeLabels = this.LeaveTypeLabels[userEntry.leaveType];
          let additionalMessage = '';

          if(userEntry.leaveType === null || userEntry.Remaining === 0){
            leaveDetails.push([
              { text: userEntry.Remaining.toString(), alignment: 'center', border: [false, false, false, false], style: 'dp', decoration: 'underline', decorationColor: 'black' },
              { text: 'No Leaves Available', alignment: 'left', border: [false, false, false, false], style: 'dp1' },
            ]);

            leaveDetails2.push([
              { text: userEntry.Remaining.toString(), alignment: 'center', border: [false, false, false, false], style: 'dp', decoration: 'underline', decorationColor: 'black' },
              { text: 'No Leaves Available', alignment: 'left', border: [false, false, false, false], style: 'dp1' },
            ]);
          } else {

            if (userEntry.leaveType === 'SL') {
              additionalMessage = ' (Attach Medical Certificate issued by the Infirmary Physician)';
            }

            if (userEntry.leaveType === 'EL') {
                additionalMessage = ' (Attach proof of emergency such as calamity, death, serious illness, and serious accident of a member of the immediate family)';
            }

            leaveDetails.push([
              { text: userEntry.Remaining.toString(), alignment: 'center', border: [false, false, false, false], style: 'dp', decoration: 'underline', decorationColor: 'black' },
              { text: leaveTypeLabels + additionalMessage, alignment: 'left', border: [false, false, false, false], style: 'dp1' },
            ]);

            leaveDetails2.push([
                { text: userEntry.Remaining.toString(), alignment: 'center', border: [false, false, false, false], style: 'dp', decoration: 'underline', decorationColor: 'black' },
                { text: leaveTypeLabels + additionalMessage, alignment: 'left', border: [false, false, false, false], style: 'dp1' },
            ]);
          }

          // Check if signatures for the current position have already been added
          if (!processedPositions.includes(userEntry.Position)) {
              processedPositions.push(userEntry.Position);

              if (userEntry.Class === 'OF') {
                  signDetails.push([
                      { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                  ]);
              } else {
                  signDetails.push([
                      { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `APPROVED BY:\nDEPARTMENT HEAD`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                  ]);
              }

              // Similar block for signDetails2
              if (userEntry.Class === 'OF') {
                  signDetails2.push([
                      { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `APPROVED BY:\nSENIOR VICE PRESIDENT / \nVICE PRESIDENT`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                  ]);
              } else {
                  signDetails2.push([
                      { text: `EMPLOYEE SIGNATURE`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `APPROVED BY:\nDEPARTMENT HEAD`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                      { text: `RECEIVED BY:\nHUMAN RESOURCE PERSONEL`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                  ]);
              }
          }

      });

      const totalPageHeight = 13 * 72;
      const nestedTableHeight = 0.5 * (totalPageHeight);

      const docDefinition = {
        pageSize: {
          width: 8.5 * 72,
          height: totalPageHeight,
        },
        pageMargins: [10, 0, 10, 0],
        background: [
          {
            image: this.base64Image,
            width: 350,
            height: 250,
            alignment: 'center',
            absolutePosition: { x: 0, y: totalPageHeight * 0.25 - 250 * 0.5 },
          },
          {
            image: this.base64Image,
            width: 350,
            height: 250,
            alignment: 'center',
            absolutePosition: { x: 0, y: totalPageHeight * 0.75 - 240 * 0.5 },
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: totalPageHeight * 0.5,
                x2: 8.5 * 72,
                y2: totalPageHeight * 0.5,
                lineWidth: 1,
                lineColor: '#000',
              },
            ],
          },
        ],
        content: [
          {
            table: {
              widths: ['*'],
              heights: [nestedTableHeight],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    stack: [
                      {
                        table: {
                          widths: ['*'],
                          body: [
                            [
                              { text: 'HRD FORM NO.____REVISED 2019', alignment: 'left', border: [false, false, false, false], style: 'foot' },
                            ]
                          ]
                        }
                      },
                      { text: '\n' },
                      { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC', style: 'header', alignment: 'center' },
                      { text: 'LEAVE APPLICATION FORM', alignment: 'center', style: 'app' },
                      {
                        table: {
                          widths: [ '*', '*', '*'],
                          body: [
                            [
                              {
                                text: [
                                  { text: 'DATE FILED: ', style: 'dp' },
                                  { text: currentDate, style: 'dp1' },
                                ],
                                border: [false, false, false, false],
                              },
                              { text: `POSITION DESCRIPTION`, alignment: 'center', border: [false, false, false, false], style: 'dp1' },
                              { text: ``, border: [false, false, false, false] },
                            ],
                          ],
                        },
                      },
                      {
                        table: {
                          widths: ['12.5%', '25%', '25%', '25%', '12.5%'],
                          body: [
                            [
                              { text: 'CODE', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'NAME', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                            ],
                            [
                              { text: `${entry.Code}`, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: `${entry.LastName}, ${entry.FirstName} ${entry.MiddleInitial}.`, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: position, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: department+ ' ' + 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: employeeStatus, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                            ],
                          ],
                        },
                      },
                      { text: ' ', fontSize: 5 },
                      { text: 'Leave Details', alignment: 'center', style: 'app' },
                      {
                        table: {
                          widths: ['25%', '75%'],
                          body: [
                            [
                              { text: 'CREDITS', alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: 'LEAVE TYPE', border: [false, false, false, false], style: 'dp' },
                            ],
                            ...leaveDetails,
                          ],
                        },
                      },
                      { text: ' ', fontSize: 8 },
                      { text: 'Leave Application Details', alignment: 'center', style: 'app' },
                      { text: ' ', fontSize: 5 },
                      {
                        table: {
                          widths: ['20%', '10%', '15%', '15%', '40%'],
                          body: [
                            [
                              { text: 'Leave Type', alignment: 'center', style: 'dp' },
                              { text: 'Days', alignment: 'center', style: 'dp' },
                              { text: 'Date From', alignment: 'center', style: 'dp' },
                              { text: 'Date To', alignment: 'center', style: 'dp' },
                              { text: 'Reason', alignment: 'center', style: 'dp' },
                            ],
                            [
                              { text: this.LeaveTypeLabels[entry.LeaveType], alignment: 'center', style: 'dp1' },
                              { text: entry.Days, alignment: 'center', style: 'dp1' },
                              { text: this.formatDateTime(entry.DateFrom), alignment: 'center', style: 'dp1' },
                              { text: this.formatDateTime(entry.DateTo), alignment: 'center', style: 'dp1' },
                              { text: entry.Reason, alignment: 'center', style: 'dp1' },
                            ],
                          ],
                        },
                      },
                      { text: '\n\n\n\n\n\n' },
                      {
                        table: {
                          widths: ['*', '*', '*'],
                          body: [
                            [
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                            ],
                            ...signDetails
                          ],
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ['*'],
              heights: [nestedTableHeight],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    stack: [
                      {
                        table: {
                          widths: ['*'],
                          body: [
                            [
                              { text: 'HRD FORM NO.____REVISED 2019', alignment: 'left', border: [false, false, false, false], style: 'foot' },
                            ]
                          ]
                        }
                      },
                      { text: '\n' },
                      { text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC', style: 'header', alignment: 'center' },
                      { text: 'LEAVE APPLICATION FORM', alignment: 'center', style: 'app' },
                      {
                        table: {
                          widths: [ '*', '*', '*'],
                          body: [
                            [
                              {
                                text: [
                                  { text: 'DATE FILED: ', style: 'dp' },
                                  { text: currentDate, style: 'dp1' },
                                ],
                                border: [false, false, false, false],
                              },
                              { text: `POSITION DESCRIPTION`, alignment: 'center', border: [false, false, false, false], style: 'dp1' },
                              { text: ``, border: [false, false, false, false] },
                            ],
                          ],
                        },
                      },
                      {
                        table: {
                          widths: ['12.5%', '25%', '25%', '25%', '12.5%'],
                          body: [
                            [
                              { text: 'CODE', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'NAME', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'POSITION', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                              { text: 'STATUS', alignment: 'center', border: [false, false, false, false], style: 'dp', fillColor: '#cccccc' },
                            ],
                            [
                              { text: `${entry.Code}`, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: `${entry.LastName}, ${entry.FirstName} ${entry.MiddleInitial}.`, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: position, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: department+ ' ' + 'DEPARTMENT', alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                              { text: employeeStatus, alignment: 'center', border: [false, false, false, false], style: 'dp1', fillColor: '#cccccc' },
                            ],
                          ],
                        },
                      },
                      { text: ' ', fontSize: 5 },
                      { text: 'Leave Details', alignment: 'center', style: 'app' },
                      {
                        table: {
                          widths: ['25%', '75%'],
                          body: [
                            [
                              { text: 'CREDITS', alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: 'LEAVE TYPE', border: [false, false, false, false], style: 'dp' },
                            ],
                            ...leaveDetails2,
                          ],
                        },
                      },
                      { text: ' ', fontSize: 8 },
                      { text: 'Leave Application Details', alignment: 'center', style: 'app' },
                      { text: ' ', fontSize: 5 },
                      {
                        table: {
                          widths: ['20%', '10%', '15%', '15%', '40%'],
                          body: [
                            [
                              { text: 'Leave Type', alignment: 'center', style: 'dp' },
                              { text: 'Days', alignment: 'center', style: 'dp' },
                              { text: 'Date From', alignment: 'center', style: 'dp' },
                              { text: 'Date To', alignment: 'center', style: 'dp' },
                              { text: 'Reason', alignment: 'center', style: 'dp' },
                            ],
                            [
                              { text: this.LeaveTypeLabels[entry.LeaveType], alignment: 'center', style: 'dp1' },
                              { text: entry.Days, alignment: 'center', style: 'dp1' },
                              { text: this.formatDateTime(entry.DateFrom), alignment: 'center', style: 'dp1' },
                              { text: this.formatDateTime(entry.DateTo), alignment: 'center', style: 'dp1' },
                              { text: entry.Reason, alignment: 'center', style: 'dp1' },
                            ],
                          ],
                        },
                      },
                      { text: '\n\n\n\n\n\n' },
                      {
                        table: {
                          widths: ['*', '*', '*'],
                          body: [
                            [
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                              { text: `___________________________________`, alignment: 'center', border: [false, false, false, false], style: 'dp' },
                            ],
                            ...signDetails2
                          ],
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        ],

        styles: {
          header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
          headerr: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
          app: { fontSize: 11, bold: true },
          dp: { fontSize: 9, bold: true },
          dp1: { fontSize: 9, bold: false, },
          foot: { fontSize: 7, bold: true },
        },

      };


      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBlob((blob) => {
          const newWindow = window.open();
          const url = URL.createObjectURL(blob);
          newWindow.location.href = url;
      });

    },

  },

  created() {
    this.loadAndConvertToBase64();
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
