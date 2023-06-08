import { Button, Col, Form, Row } from "antd";
import React, { useState } from "react";
import StatisticalProcessingItem from "./statisticalProcessing/statisticalProcessingItem";

const StatisticalProcessingForm = ({ setValues, setWorkspaceTypeDetails }) => {
  const [shapiroWilkTestEnabled, setShapiroWilkTestEnabled] = useState(false);
  const [shapiroColumn, setShapiroColumn] = useState("");
  const [dagostinoK2TestEnabled, setDagostinoK2TestEnabled] = useState(false);
  const [dagostinoK2Column, setDagostinoK2Column] = useState("");
  const [andersonDarlingTestEnabled, setAndersonDarlingTestEnabled] =
    useState(false);
  const [andersonDarlingColumn, setAndersonDarlingColumn] = useState("");
  useState(false);
  const [pearsonCorrelationTestEnabled, setPearsonCorrelationEnabled] =
    useState(false);
  const [pearsonCorrelationColumn1, setPearsonCorrelationColumn1] =
    useState("");
  const [pearsonCorrelationColumn2, setPearsonCorrelationColumn2] =
    useState("");
  const [spearmanCorrelationTestEnabled, setSpearmanCorrelationEnabled] =
    useState(false);
  const [spearmanCorrelationColumn1, setSpearmanCorrelationColumn1] =
    useState("");
  const [spearmanCorrelationColumn2, setSpearmanCorrelationColumn2] =
    useState("");
  const [kendallCorrelationTestEnabled, setKendallCorrelationEnabled] =
    useState(false);
  const [kendallCorrelationColumn1, setKendallCorrelationColumn1] =
    useState("");
  const [kendallCorrelationColumn2, setKendallCorrelationColumn2] =
    useState("");
  const [chiSquareTestEnabled, setChiSquareEnabled] = useState(false);
  const [chiSquareColumn1, setChiSquareColumn1] = useState("");
  const [chiSquareColumn2, setChiSquareColumn2] = useState("");
  const [augmentedTestEnabled, setAugmentedEnabled] = useState(false);
  const [augmentedColumn1, setAugmentedColumn1] = useState("");
  const [kwiatkowskiTestEnabled, setKwiatkowskiEnabled] = useState(false);
  const [kwiatkowskiColumn1, setKwiatkowskiColumn1] = useState("");
  const [tTestEnabled, setTEnabled] = useState(false);
  const [tColumn1, setTColumn1] = useState("");
  const [tColumn2, setTColumn2] = useState("");
  const [pairedtTestEnabled, setPairedtEnabled] = useState(false);
  const [pairedtColumn1, setPairedtColumn1] = useState("");
  const [pairedtColumn2, setPairedtColumn2] = useState("");
  const [anovaTestEnabled, setAnovaEnabled] = useState(false);
  const [anovaColumn1, setAnovaColumn1] = useState("");
  const [anovaColumn2, setAnovaColumn2] = useState("");
  const [anovaColumn3, setAnovaColumn3] = useState("");
  const [mannTestEnabled, setMannEnabled] = useState(false);
  const [mannColumn1, setMannColumn1] = useState("");
  const [mannColumn2, setMannColumn2] = useState("");
  const [wilcoxonTestEnabled, setWilcoxonEnabled] = useState(false);
  const [wilcoxonColumn1, setWilcoxonColumn1] = useState("");
  const [wilcoxonColumn2, setWilcoxonColumn2] = useState("");
  const [kruskalTestEnabled, setKruskalEnabled] = useState(false);
  const [kruskalColumn1, setKruskalColumn1] = useState("");
  const [kruskalColumn2, setKruskalColumn2] = useState("");
  const [friedmanTestEnabled, setFriedmanEnabled] = useState(false);
  const [friedmanColumn1, setFriedmanColumn1] = useState("");
  const [friedmanColumn2, setFriedmanColumn2] = useState("");
  const [friedmanColumn3, setFriedmanColumn3] = useState("");

  const onFinish = (values) => {
    let test = [];
    !shapiroWilkTestEnabled
      ? (values["shapiro_wilk"] = undefined)
      : (values["shapiro_wilk"] = [shapiroColumn]);
    !dagostinoK2TestEnabled
      ? (values["dagostino_k2"] = undefined)
      : (values["dagostino_k2"] = [dagostinoK2Column]);
    !andersonDarlingTestEnabled
      ? (values["anderson_darling"] = undefined)
      : (values["anderson_darling"] = [andersonDarlingColumn]);
    !pearsonCorrelationTestEnabled
      ? (values["pearson_correlation"] = undefined)
      : (values["pearson_correlation"] = [
          pearsonCorrelationColumn1,
          pearsonCorrelationColumn2,
        ]);
    !spearmanCorrelationTestEnabled
      ? (values["spearman_correlation"] = undefined)
      : (values["spearman_correlation"] = [
          spearmanCorrelationColumn1,
          spearmanCorrelationColumn2,
        ]);
    !kendallCorrelationTestEnabled
      ? (values["kendall_correlation"] = undefined)
      : (values["kendall_correlation"] = [
          kendallCorrelationColumn1,
          kendallCorrelationColumn2,
        ]);
    !chiSquareTestEnabled
      ? (values["chi_square"] = undefined)
      : (values["chi_square"] = [chiSquareColumn1, chiSquareColumn2]);
    !augmentedTestEnabled
      ? (values["augmented_dickey_fuller"] = undefined)
      : (values["augmented_dickey_fuller"] = [augmentedColumn1]);
    !kwiatkowskiTestEnabled
      ? (values["kwiatkowski"] = undefined)
      : (values["kwiatkowski"] = [kwiatkowskiColumn1]);
    !tTestEnabled
      ? (values["student_t"] = undefined)
      : (values["student_t"] = [tColumn1, tColumn2]);
    !pairedtTestEnabled
      ? (values["paired_student_t"] = undefined)
      : (values["paired_student_t"] = [pairedtColumn1, pairedtColumn2]);
    !anovaTestEnabled
      ? (values["analysis_of_variance"] = undefined)
      : (values["analysis_of_variance"] = [
          anovaColumn1,
          anovaColumn2,
          anovaColumn3,
        ]);
    !mannTestEnabled
      ? (values["mann_whitney_u"] = undefined)
      : (values["mann_whitney_u"] = [mannColumn1, mannColumn2]);
    !wilcoxonTestEnabled
      ? (values["wilcoxon_signed_rank"] = undefined)
      : (values["wilcoxon_signed_rank"] = [wilcoxonColumn1, wilcoxonColumn2]);
    !kruskalTestEnabled
      ? (values["kruskal_wallis"] = undefined)
      : (values["kruskal_wallis"] = [kruskalColumn1, kruskalColumn2]);
    !friedmanTestEnabled
      ? (values["friedman"] = undefined)
      : (values["friedman"] = [
          friedmanColumn1,
          friedmanColumn2,
          friedmanColumn3,
        ]);

    for (const [key, value] of Object.entries(values)) {
      if (value != undefined) {
        let obj = {};
        obj["test_name"] = key;
        obj[`column_${1}`] = value[0];
        value.length > 1 && (obj[`column_${2}`] = value[1]);
        value.length > 2 && (obj[`column_${3}`] = value[2]);
        test.push(obj);
      }
    }

    setValues(test);
    setWorkspaceTypeDetails("statistical");
  };

  const statisticalTestArray = [
    {
      idx: 0,
      checkTestEnabled: shapiroWilkTestEnabled,
      setCheckTestEnabled: setShapiroWilkTestEnabled,
      column1: shapiroColumn,
      setColumn1: setShapiroColumn,
    },
    {
      idx: 1,
      checkTestEnabled: dagostinoK2TestEnabled,
      setCheckTestEnabled: setDagostinoK2TestEnabled,
      column1: dagostinoK2Column,
      setColumn1: setDagostinoK2Column,
    },
    {
      idx: 2,
      checkTestEnabled: andersonDarlingTestEnabled,
      setCheckTestEnabled: setAndersonDarlingTestEnabled,
      column1: andersonDarlingColumn,
      setColumn1: setAndersonDarlingColumn,
    },
    {
      idx: 3,
      checkTestEnabled: pearsonCorrelationTestEnabled,
      setCheckTestEnabled: setPearsonCorrelationEnabled,
      column1: pearsonCorrelationColumn1,
      setColumn1: setPearsonCorrelationColumn1,
      column2: pearsonCorrelationColumn2,
      setColumn2: setPearsonCorrelationColumn2,
    },
  ];

  const statisticalTestArray2 = [
    {
      idx: 4,
      checkTestEnabled: spearmanCorrelationTestEnabled,
      setCheckTestEnabled: setSpearmanCorrelationEnabled,
      column1: spearmanCorrelationColumn1,
      setColumn1: setSpearmanCorrelationColumn1,
      column2: spearmanCorrelationColumn2,
      setColumn2: setSpearmanCorrelationColumn2,
    },
    {
      idx: 5,
      checkTestEnabled: kendallCorrelationTestEnabled,
      setCheckTestEnabled: setKendallCorrelationEnabled,
      column1: kendallCorrelationColumn1,
      setColumn1: setKendallCorrelationColumn1,
      column2: kendallCorrelationColumn2,
      setColumn2: setKendallCorrelationColumn2,
    },
    {
      idx: 6,
      checkTestEnabled: chiSquareTestEnabled,
      setCheckTestEnabled: setChiSquareEnabled,
      column1: chiSquareColumn1,
      setColumn1: setChiSquareColumn1,
      column2: chiSquareColumn2,
      setColumn2: setChiSquareColumn2,
    },
    {
      idx: 7,
      checkTestEnabled: augmentedTestEnabled,
      setCheckTestEnabled: setAugmentedEnabled,
      column1: augmentedColumn1,
      setColumn1: setAugmentedColumn1,
    },
  ];

  const statisticalTestArray3 = [
    {
      idx: 8,
      checkTestEnabled: kwiatkowskiTestEnabled,
      setCheckTestEnabled: setKwiatkowskiEnabled,
      column1: kwiatkowskiColumn1,
      setColumn1: setKwiatkowskiColumn1,
    },
    {
      idx: 9,
      checkTestEnabled: tTestEnabled,
      setCheckTestEnabled: setTEnabled,
      column1: tColumn1,
      setColumn1: setTColumn1,
      column2: tColumn2,
      setColumn2: setTColumn2,
    },
    {
      idx: 10,
      checkTestEnabled: pairedtTestEnabled,
      setCheckTestEnabled: setPairedtEnabled,
      column1: pairedtColumn1,
      setColumn1: setPairedtColumn1,
      column2: pairedtColumn2,
      setColumn2: setPairedtColumn2,
    },
    {
      idx: 11,
      checkTestEnabled: anovaTestEnabled,
      setCheckTestEnabled: setAnovaEnabled,
      column1: anovaColumn1,
      setColumn1: setAnovaColumn1,
      column2: anovaColumn2,
      setColumn2: setAnovaColumn2,
      column3: anovaColumn3,
      setColumn3: setAnovaColumn3,
    },
  ];

  const statisticalTestArray4 = [
    {
      idx: 12,
      checkTestEnabled: mannTestEnabled,
      setCheckTestEnabled: setMannEnabled,
      column1: mannColumn1,
      setColumn1: setMannColumn1,
      column2: mannColumn2,
      setColumn2: setMannColumn2,
    },
    {
      idx: 13,
      checkTestEnabled: wilcoxonTestEnabled,
      setCheckTestEnabled: setWilcoxonEnabled,
      column1: wilcoxonColumn1,
      setColumn1: setWilcoxonColumn1,
      column2: wilcoxonColumn2,
      setColumn2: setWilcoxonColumn2,
    },
    {
      idx: 14,
      checkTestEnabled: kruskalTestEnabled,
      setCheckTestEnabled: setKruskalEnabled,
      column1: kruskalColumn1,
      setColumn1: setKruskalColumn1,
      column2: kruskalColumn2,
      setColumn2: setKruskalColumn2,
    },
    {
      idx: 15,
      checkTestEnabled: friedmanTestEnabled,
      setCheckTestEnabled: setFriedmanEnabled,
      column1: friedmanColumn1,
      setColumn1: setFriedmanColumn1,
      column2: friedmanColumn2,
      setColumn2: setFriedmanColumn2,
      column3: friedmanColumn3,
      setColumn3: setFriedmanColumn3,
    },
  ];

  return (
    <>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[0, 0]}>
          <Col span={6}>
            {statisticalTestArray.map((test) => {
              return (
                <>
                  <StatisticalProcessingItem
                    idx={test.idx}
                    checkTestEnabled={test.checkTestEnabled}
                    setCheckTestEnabled={test.setCheckTestEnabled}
                    column1={test.column1}
                    setColumn1={test.setColumn1}
                    column2={test.column2}
                    setColumn2={test.setColumn2}
                  ></StatisticalProcessingItem>
                </>
              );
            })}
          </Col>
          <Col span={6}>
            {statisticalTestArray2.map((test) => {
              return (
                <>
                  <StatisticalProcessingItem
                    idx={test.idx}
                    checkTestEnabled={test.checkTestEnabled}
                    setCheckTestEnabled={test.setCheckTestEnabled}
                    column1={test.column1}
                    setColumn1={test.setColumn1}
                    column2={test.column2}
                    setColumn2={test.setColumn2}
                  ></StatisticalProcessingItem>
                </>
              );
            })}
          </Col>
          <Col span={6}>
            {statisticalTestArray3.map((test) => {
              return (
                <>
                  <StatisticalProcessingItem
                    idx={test.idx}
                    checkTestEnabled={test.checkTestEnabled}
                    setCheckTestEnabled={test.setCheckTestEnabled}
                    column1={test.column1}
                    setColumn1={test.setColumn1}
                    column2={test.column2}
                    setColumn2={test.setColumn2}
                    column3={test.column3}
                    setColumn3={test.setColumn3}
                  ></StatisticalProcessingItem>
                </>
              );
            })}
          </Col>
          <Col span={6}>
            {statisticalTestArray4.map((test) => {
              return (
                <>
                  <StatisticalProcessingItem
                    idx={test.idx}
                    checkTestEnabled={test.checkTestEnabled}
                    setCheckTestEnabled={test.setCheckTestEnabled}
                    column1={test.column1}
                    setColumn1={test.setColumn1}
                    column2={test.column2}
                    setColumn2={test.setColumn2}
                    column3={test.column3}
                    setColumn3={test.setColumn3}
                  ></StatisticalProcessingItem>
                </>
              );
            })}
          </Col>
        </Row>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="form-button-color"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StatisticalProcessingForm;
