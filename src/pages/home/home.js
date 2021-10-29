import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";

const CreateClassDialog = ({ handleClose, open, classes, setClasses }) => {
  const [classname, setClassName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [classAvatar, setClassAvatar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setClassName("");
    setTeacher("");
    setClassAvatar("");
    setError("");
    setLoading(false);
  };

  const onCreate = async () => {
    setError("");
    setLoading(true);
    await axios
      .post("/class", {
        name: classname,
        teacher: teacher,
        avatar: classAvatar,
      })
      .then((res) => {
        setOpenSnackbar(true);
        setClasses((prev) => [res.data, ...prev]);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false);
        resetState();
        handleClose();
      });
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box
            style={{ minWidth: 300, display: "flex", flexDirection: "column" }}
          >
            <Typography>Tạo lớp mới</Typography>
            <TextField
              margin="dense"
              placeholder="Nhập tên lớp"
              label="Tên lớp"
              value={classname}
              onChange={(e) => {
                setClassName(e.target.value);
              }}
            ></TextField>
            <TextField
              value={teacher}
              margin="dense"
              placeholder="Nhập tên người tạo"
              label="Tên người tạo"
              onChange={(e) => {
                setTeacher(e.target.value);
              }}
            ></TextField>
            <TextField
              value={classAvatar}
              margin="dense"
              placeholder="Link ảnh lớp"
              label="Link ảnh lớp"
              onChange={(e) => {
                setClassAvatar(e.target.value);
              }}
            ></TextField>
            <Typography color="error">{error}</Typography>
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: 16 }}>
          {loading && (
            <Typography style={{ marginRight: 16, color: "#1e88e5" }}>
              Đang tải lên...
            </Typography>
          )}
          <Button
            color="inherit"
            variant="contained"
            onClick={() => handleClose()}
            size="small"
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onCreate();
            }}
            size="small"
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Tạo lớp thành công !
        </Alert>
      </Snackbar>
    </>
  );
};

const ClassItem = ({ data }) => {
  return (
    <Grid item xs={3}>
      <Paper elevation={10} style={{ width: "100%", height: "100%" }}>
        <Box p={2}>
          <Box style={{ background: "#e8e8e8" }}>
            <img
              src={data.avatar}
              style={{ objectFit: "contain", width: "100%", height: 300 }}
              alt="cover"
            />
          </Box>
          <Box style={{ display: "flex" }} mt={1}>
            <Typography style={{ fontWeight: 600 }}>{data.name}</Typography>
            &nbsp;{" - "}&nbsp;
            <Typography>{data.teacher}</Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

const HomePage = () => {
  const [classes, setClasses] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const getClass = async () => {
      await axios
        .get("/class")
        .then((res) => {
          setClasses(res.data);
        })
        .catch((error) => console.log(error));
    };
    getClass();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button
        style={{ textTransform: "none", margin: 36, width: 200 }}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Tạo lớp mới
      </Button>

      <Grid container spacing={2}>
        {classes.map((data) => {
          return <ClassItem data={data} />;
        })}
      </Grid>
      <CreateClassDialog
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        classes={classes}
        setClasses={setClasses}
      />
    </div>
  );
};

export default HomePage;
