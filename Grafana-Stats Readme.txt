Grafana-Stats für VIS (by dna909)


Voraussetzung:

laufende Grafana-Installation, mit folgenden Einstellungen:

[auth.basic] 
enabled=true

[auth.anonymous]
enabled = true

org_name = Main Org.

org_role = Viewer

--------------------------------------------------------------------

In VIS ein Basic-IFrame mit der Quelle des Datenpunktes der Snapshot-URL (z.B. {javascript.0.Grafana.DashboardURL} ).
z.B. 1, oder mehrere Buttons (Button State), mit denen der Name des Dashboards an den Datenpunkt (javascript.0.Grafana.DashboardName) 
übergeben wird.

In Grafana einen User anlegen mit Editor-Rechten. Anschließend für diesen User einen API-Key generieren.
User,Passwort und API-Key im Script eintragen.
IP-Adresse, Port und ggf. Protokoll anpassen.

Der Datenpunkt DashboardName wird auf Änderung überwacht. Sobald der Wert geändert wurde fragt das Script beim Grafana-Server nach den JSON-Daten des benannten Dashboards.
Mit diesen Daten wird dann mit einem HTTP-POST das Snapshot erzeugt und die erzeugte URL in den Datenpunkt DashboardURL geschrieben.

Zusätzlich wird bei jeder Aktualisierung der alte Snapshot auf dem Grafana-Server gelöscht.



Viel Spaß damit


Gruß

dna909


