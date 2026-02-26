import React, { useState, useEffect } from "react";

const emissionFactorOptions = {
        source1: ["Gas/Diesel oil", "Fuel Wood", "Fuel oil C",],
        source2: ["Gas/Diesel oil", "Motor Gasoline"],
        source3: ["Diesel-Arglicuture", "Diesel-Foresty", "Diesel-Household", "Diesel-Industry"],
        source4: ["CH4 ระบบ Septic tank", "CH4 ระบบบำบัดน้ำเสีย"],
    };

export default function Scope1Mockup() {

    const [source, setSource] = useState("");
    const [activity,setActivity]=useState("");
    const [PE, setPE] = useState("");
    const [emissionFactor, setEmissionFactor] = useState("");
    const [employeesType, setemployeesType] = useState("");

    // septic tank monthly states (12 เดือน)
    const [employees, setEmployees] = useState(Array(12).fill(0));
    const [operatingDays, setOperatingDays] = useState(Array(12).fill(0));
    const [operatingMode, setOperatingMode] = useState("monthly"); // monthly | yearly
    const [manhoursPerDay, setManhoursPerDay] = useState(0);


    const [showPopup, setShowPopup] = useState(false);
    const [records, setRecords] = useState([]);

    

    // ✅ ทุกครั้งที่ source เปลี่ยน → reset EF ไป index 0
    useEffect(() => {
        if (source && emissionFactorOptions[source]) {
            setEmissionFactor(emissionFactorOptions[source][0]);
        } else {
            setEmissionFactor("");
        }
    }, [source]);

    const monthLabels = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const sourcePE = {
        north: 40,
        northeast: 40,
        central: 50,
        south: 50
    };

    const handleMonthlyChange = (setter, index, value) => {
        setter(prev => {
            const updated = [...prev];
            updated[index] = Number(value);
            return updated;
        });
    };

    const averageEmployees = employees.length > 0
        ? employees.reduce((a, b) => a + b, 0) / employees.length
        : 0;
    // const totalOperatingDays = operatingDays.reduce((a, b) => a + b, 0);
    const totalOperatingDays = operatingMode === "monthly"
        ? operatingDays.reduce((a, b) => a + b, 0)
        : operatingDays[0] || 0;

    const totalEmployees = employees.reduce((a, b) => a + b, 0);
    const totalManhoursPerYear = totalEmployees * totalOperatingDays * Number(manhoursPerDay || 0);

    const totalAllManhours = records.reduce(
        (sum, r) => sum + Number(r.totalManhoursPerYear || 0),
        0
    );

    const ghgLabels = [
        "CO2", "FossilCH4", "CH4", "N2O",
        "SF6", "NF3", "HFC5", "PFC5"
    ];

    const [ghgData, setGhgData] = useState({
        CO2: "-",
        FossilCH4: "-",
        CH4: "-",
        N2O: "-",
        SF6: "-",
        NF3: "-",
        HFC5: "-",
        PFC5: "-"
    });

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <h2>เพิ่มข้อมูล Scope 1</h2>
                    <span style={styles.close}>✕</span>
                </div>

                {/* รายการ */}
                <div style={styles.section}>
                    <label>รายการ *</label>
                    {/* เปลี่ยนเป็น Drop Down ดึงมาจาก */}
                    {/* <textarea placeholder="รายการ" rows={2} style={styles.input} /> */}
                    <select style={styles.input}
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                    // onChange={(e) => setSource(e.target.value)}
                    >
                        <option value="">รายการกิจกรรม scope1</option>
                        <option value="">น้ำมันเตาสำหรับหม้อไอน้ำที่ติดตั้งภายในโรงงาน (น้ำมันเตา C)</option>
                        <option value="">เศษไม้ที่ใช้ในการผลิตไฟฟ้า (โรงไฟฟ้าของตัวเอง)</option>
                        <option value="">น้ำมันดีเซล B7 สำหรับรถ Forklift ที่ใช้ในโรงงาน</option>
                        <option value="">น้ำมันดีเซล B7 สำหรับรถตู้รับส่งผู้บริหารและแขกของบริษัท</option>
                        <option value="">การรั่วไหลของสารทำความเย็น HFC-134a</option>
                        <option value="">BOD ในระบบ Septic Tank</option>
                        <option value="">COD ที่เข้าสู่ระบบบำบัด</option>
                    </select>
                </div>

                {/* Source / EF / Unit */}
                <div style={styles.grid3}>
                    <div style={styles.section}>
                        <label>SOURCE *</label>
                        <select style={styles.input}
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        >
                            <option value="">เลือก Source</option>
                            <option value="source1">Stationary Combustion</option>
                            <option value="source2">Mobile Combustion: On Road</option>
                            <option value="source3">Mobile Combustion: Off Road</option>
                            <option value="source4">Fugitive</option>
                        </select>
                    </div>

                    <div style={styles.section}>
                        <label>EMISSION FACTOR</label>
                        <select
                            style={styles.input}
                            value={emissionFactor}
                            onChange={(e) => setEmissionFactor(e.target.value)}
                            disabled={!source}
                        >
                            {!source && <option value="">เลือก Emission Factor</option>}
                            {source &&
                                emissionFactorOptions[source].map((ef, index) => (
                                    <option key={index} value={ef}>
                                        {ef}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div style={styles.section}>
                        <label>หน่วย *</label>
                        <select style={styles.input}>
                            <option>หน่วย</option>
                            <option>Liter</option>
                            <option>Kg</option>
                        </select>
                    </div>
                </div>

                {/* ✅ แสดงเฉพาะเมื่อเลือก septic tank */}
                {emissionFactor === "CH4 ระบบ Septic tank" && (

                    <div style={{ marginTop: 10 }}>
                        {records.length > 0 && (
                            <div style={{ marginTop: 20 }}>

                                <h3>รายการ Manhours</h3>
                                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                                    <thead>
                                        <tr style={{ background: "#f3f4f6" }}>
                                            <th style={styles.th}>กลุ่มพนักงาน</th>
                                            <th style={styles.th}>จำนวนพนักงานเฉลี่ยต่อปี</th>
                                            <th style={styles.th}>ชั่วโมงทำงาน/วัน</th>
                                            <th style={styles.th}>จำนวนวันเปิดทำการต่อปี</th>
                                            <th style={styles.th}>ชั่วโมงรวมต่อปี</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {records.map((r, i) => (
                                            <tr key={i}>
                                                <td style={styles.td}>{r.employeesType}</td>
                                                <td style={styles.td}>{r.averageEmployees.toFixed(0)}</td>
                                                <td style={styles.td}>{r.manhoursPerDay}</td>
                                                <td style={styles.td}>{r.totalOperatingDays}</td>
                                                <td style={styles.td}>{r.totalManhoursPerYear.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button
                            style={styles.addBtn}
                            onClick={() => setShowPopup(true)}
                        >
                            เพิ่มกลุ่มพนักงาน
                        </button>
                    </div>
                )}

                <hr style={{ margin: "10px 0" }} />
                <div style={styles.section}>
                    <label>แหล่งที่มา Emission Factor</label>
                    <div style={styles.efSourceSection}>
                        {[
                            "Self collect",
                            "Supplier",
                            "TH LCI DB",
                            "TGO EF",
                            "Thai Res.",
                            "Int. DB",
                            "Other (กรณีใช้ค่า EF จากแหล่งอื่นแนบเอกสารเพิ่มเติม)",
                            "Substitute"
                        ].map((item, index) => (
                            <label key={index} style={styles.checkboxGrid}>
                                <input type="checkbox" />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>


                {/* ✅ POPUP FORM */}
                {showPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <h3>ข้อมูลพนักงาน</h3>
                            <div style={styles.section}>
                                <label>กลุ่มพนักงาน *</label>
                                <textarea
                                    placeholder="กลุ่มพนักงาน"
                                    value={employeesType}
                                    onChange={(e) => setemployeesType(e.target.value)}
                                    rows={2}
                                    style={styles.input}
                                />
                            </div>
                            <h4>จำนวนพนักงานองค์กร *</h4>
                            <div style={styles.monthGrid}>
                                {monthLabels.map((m, i) => (
                                    <div key={i} style={styles.monthBox}>
                                        <label>{m}</label>
                                        <input
                                            type="number"
                                            value={employees[i]}
                                            onChange={(e) => handleMonthlyChange(setEmployees, i, e.target.value)}
                                            style={styles.input_septic}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={styles.totalRow}>
                                <strong>จำนวนรวม: {averageEmployees.toFixed(0)} คน</strong><br />
                            </div>
                            <hr style={{ margin: "30px 0" }} />

                            <h3>จำนวนการทำงาน *</h3>
                            <div>
                                <input
                                    type="number"
                                    value={manhoursPerDay}
                                    onChange={(e) => setManhoursPerDay(Number(e.target.value))}
                                    style={styles.input_septic}
                                />
                                <strong>&emsp;ชั่วโมง/วัน</strong>
                            </div>

                            <hr style={{ margin: "30px 0" }} />

                            {/* จำนวนวันเปิดดำเนินการ */}
                            <h3>จำนวนวันเปิดดำเนินการ *</h3>
                            {/* Radio Option */}
                            <div style={{ marginBottom: 15 }}>
                                <label style={{ marginRight: 15 }}>
                                    <input
                                        type="radio"
                                        value="monthly"
                                        checked={operatingMode === "monthly"}
                                        onChange={(e) => setOperatingMode(e.target.value)}
                                    /> รายเดือน
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="yearly"
                                        checked={operatingMode === "yearly"}
                                        onChange={(e) => setOperatingMode(e.target.value)}
                                    /> รายปี
                                </label>
                            </div>

                            {operatingMode === "monthly" ? (
                                <>
                                    <div style={styles.monthGrid}>
                                        {monthLabels.map((m, i) => (
                                            <div key={i} style={styles.monthBox}>
                                                <label>{m}</label>
                                                <input
                                                    type="number"
                                                    value={operatingDays[i]}
                                                    onChange={(e) => handleMonthlyChange(setOperatingDays, i, e.target.value)}
                                                    style={styles.input_septic}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={styles.totalRow}>
                                        จำนวนรวม: {totalOperatingDays} วัน
                                    </div>
                                </>
                            ) : (
                                <div style={{ marginTop: 10 }}>
                                    <input
                                        type="number"
                                        value={operatingDays[0]}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setOperatingDays([val]);
                                        }}
                                        style={{ ...styles.input_septic, maxWidth: 200 }}
                                    />
                                    <div style={styles.totalRow}>
                                        จำนวนรวม: {totalOperatingDays.toFixed(0)} วัน
                                    </div>
                                </div>
                            )}

                            <div style={styles.popupFooter}>
                                <button
                                    style={styles.cancelBtn}
                                    onClick={() => setShowPopup(false)}
                                >
                                    ยกเลิก
                                </button>
                                {/* <button style={styles.saveBtn}>บันทึก</button> */}
                                <button
                                    style={styles.saveBtn}
                                    onClick={() => {
                                        setRecords(prev => [
                                            ...prev,
                                            {
                                                employeesType,
                                                averageEmployees,
                                                manhoursPerDay: Number(manhoursPerDay),
                                                totalOperatingDays,
                                                totalManhoursPerYear
                                            }
                                        ]);
                                        setShowPopup(false);
                                        setemployeesType("");
                                        setEmployees(Array(12).fill(0));
                                        setOperatingDays(Array(12).fill(0));
                                        setManhoursPerDay(0);
                                    }}
                                >
                                    บันทึก
                                </button>
                            </div>

                        </div>



                    </div>
                )}

                {/* ไฟล์หลักฐาน */}
                <div style={styles.uploadBox}>
                    <h3>ไฟล์หลักฐาน</h3>
                    <div style={styles.uploadGrid}>
                        <div style={styles.uploadArea}>
                            <p style={{ fontSize: 40 }}>☁</p>
                            <p>Click to upload</p>
                            <p style={{ fontSize: 12 }}>
                                xlsx, csv, PDF, JPG, PNG, docx, zip, rar (10 mb)
                            </p>
                        </div>
                        <div style={styles.infoBox}>
                            <p>1. ที่ตั้ง/ตำแหน่ง/จุดที่ตรวจวัด</p>
                            <p>2. ที่มาของข้อมูลกิจกรรม (ตรวจวัด,ชำระเงิน,ประมาณค่า)</p>
                            <p>3. หลักฐาน/เอกสารอ้างอิงข้อมูลกิจกรรม</p>
                            <p>4. ที่มาของค่า EF (Custom)</p>
                            <p>
                                5. บันทึกการสอบเทียบอุปกรณ์/เครื่องมือวัด (Calibration
                                Record) (ถ้ามี)
                            </p>
                        </div>
                    </div>
                </div>

                {/* ประเภทการกรอกปริมาณ */}
                <div style={styles.grid2}>
                    <div>
                        <label>ค่าสมมูลประชากรแบ่งความภาค *</label>
                        <div style={styles.section}>
                            <select style={styles.input}
                                value={PE}
                                onChange={(e) => setPE(e.target.value)}
                            >
                                <option value="">เลือกภาค</option>
                                {/* ดึงจาก Table Septic_PE */}
                                <option value={sourcePE.north}>ภาคเหนือ</option>
                                <option value={sourcePE.northeast}>ภาคอีสาน</option>
                                <option value={sourcePE.central}>ภาคกลาง</option>
                                <option value={sourcePE.south}>ภาคใต้</option>
                            </select>
                            {PE && (
                                <strong style={{ marginLeft: 10 }}>
                                    {PE} กรัม BOD/คน-วัน
                                </strong>
                            )}
                        </div>
                    </div>

                    <div style={styles.section}>
                        <label>ปริมาณการทำงานทั้งหมด *</label>
                        <input type="number"
                            value={totalAllManhours}
                            readOnly
                            style={styles.input} />
                        <label>คน-ชั่วโมง/ปี</label>
                    </div>
                </div>

                {/* แหล่งอ้างอิง / คำอธิบาย */}
                <div style={styles.grid2}>
                    <div style={styles.section}>
                        <label>แหล่งอ้างอิง</label>
                        <input placeholder="แหล่งอ้างอิง" style={styles.input} />
                    </div>
                    <div style={styles.section}>
                        <label>คำอธิบายเพิ่มเติม</label>
                        <input placeholder="คำอธิบายเพิ่มเติม" style={styles.input} />
                    </div>
                </div>

                <div style={styles.cardContainer}>
                    <div style={styles.ghgGrid}>

                        {ghgLabels.map(label => (
                            <div style={styles.gridHeader}>
                                {label.replace("FossilCH4", "Fossil CH4")}
                            </div>
                        ))}

                        {ghgLabels.map(label => (
                            <div style={styles.gridValue}>
                                {ghgData[label] ?? "-"}
                            </div>
                        ))}

                    </div>
                </div>

                <div style={styles.gridGWP}>
                    <div style={styles.cardGWP}>
                        <h4 style={styles.cardTitle}>GWP100</h4>
                        <div style={styles.divider} />
                        <div style={styles.gwpRow}>
                            <div>HFC5</div>
                            <div>-</div>
                            <div>PFC5</div>
                            <div>-</div>
                        </div>
                    </div>

                    <div style={styles.cardGWP}>
                        <h4 style={styles.cardTitle}>GHG นอกข้อกำหนด</h4>
                        <div style={styles.divider} />
                        <div style={styles.gwpRow}>
                            <div>ค่า EF (kg GHG/หน่วย)</div>
                            <div>-</div>
                            <div>ค่า GWP100</div>
                            <div>-</div>
                        </div>
                    </div>

                    <div style={styles.summaryCard}>
                        <h4 style={styles.cardTitle}>ค่าการปล่อยก๊าซเรือนกระจก</h4>
                        <div style={styles.divider} />
                        <div style={styles.rowBetween}>
                            <span>ค่า emission factor</span>
                            <span>-</span>
                        </div>

                        <div style={styles.rowBetween}>
                            <span>Total GHG (tCO2eq)</span>
                            <span>-</span>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <button style={styles.cancelBtn}>ยกเลิก</button>
                    <button style={styles.saveBtn}>บันทึก</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    card: {
        color: "#000000",
        background: "#ffffff",
        padding: 30,
        borderRadius: 16,
        width: "100%",
        maxWidth: 1920,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
    checkboxItems: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    efSourceSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginBottom: "20px"
    },
    checkboxGrid: {
        display: "flex",
        alignItems: "center",
        gap: "6px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    close: {
        cursor: "pointer",
        fontSize: 18,
    },
    section: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 20,
    },
    input: {
        background: "#f9fafb",
        color: "#000000",
        padding: 10,
        borderRadius: 8,
        border: "1px solid #d1d5db",
        marginTop: 5,
    },
    input_septic: {
        background: "#f9fafb",
        color: "#000000",
        width: "100px",
        padding: 10,
        borderRadius: 8,
        border: "1px solid #d1d5db",
        marginTop: 5,
    },
    grid3: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 20,
    },
    uploadBox: {
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    uploadGrid: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 20,
    },
    uploadArea: {
        border: "2px dashed #d1d5db",
        borderRadius: 12,
        padding: 40,
        textAlign: "center",
        color: "#6b7280",
    },
    infoBox: {
        background: "#EBF5FF",
        padding: 15,
        borderRadius: 12,
        fontSize: 14,
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
    },
    saveBtn: {
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
    },
    septicSection: {
        marginTop: 30,
        background: "#f9fafb",
        padding: 20,
        borderRadius: 12,
    },
    monthGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 15,
        marginTop: 15,
    },
    monthBox: {
        display: "flex",
        flexDirection: "column",
    },
    totalRow: {
        marginTop: 20,
        textAlign: "right",
        fontSize: 18,
    },
    cancelBtn: {
        color: "#000000",
        padding: "8px 16px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        background: "white",
        cursor: "pointer",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        background: "white",
        width: "90%",
        maxWidth: 1100,
        maxHeight: "90vh",
        overflowY: "auto",
        padding: 30,
        borderRadius: 12,
    },

    cardContainer: {
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        padding: "0",
        overflow: "hidden",
        marginBottom: "20px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        background: "#f3f4f6",
        padding: "14px",
        fontWeight: "600",
        textAlign: "center",
        borderBottom: "1px solid #e5e7eb"
    },
    td: {
        padding: "14px",
        textAlign: "center",
        borderBottom: "1px solid #e5e7eb"
    },
    gridSection: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        alignItems: "start"
    },
    cardGWP: {
        background: "#f9fafb",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    gridGWP: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "20px",
        alignItems: "start"
    },
    cardTitle: {
        color: "#21BED9",
        margin: 0
    },
    divider: {
        height: "1px",
        background: "#d1d5db",
        margin: "10px 0"
    },
    gwpRow: {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto 1fr",
        gap: 10,
        alignItems: "center"
    },
    summaryCard: {
        gridColumn:"2",
        background: "#e5e7eb",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px"
    },
    rowBetween: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        marginBottom: "10px"
    },

    ghgGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gridTemplateRows: "auto auto",
        textAlign: "center"
    },

    gridHeader: {
        padding: 10,
        fontWeight: "bold",
        textAlign: "left"
    },

    gridValue: {
        padding: 10,
        borderTop: "1px solid #e5e7eb",
        textAlign: "left"
    },

};